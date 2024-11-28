import type { LocalAuthCredentials, PPTPCredentials, ApiResponse, ApiError } from '../types/mikrotik';
import { createApiClient } from './api-client';
import { API_CONFIG } from '../config/constants';
import { logger } from './logger';

export const authenticateLocal = async (
  credentials: LocalAuthCredentials
): Promise<ApiResponse> => {
  try {
    logger.log('info', 'Attempting local authentication', { ipAddress: credentials.ipAddress });
    const client = createApiClient();
    
    const response = await client.get('/rest/system/identity', {
      auth: {
        username: credentials.username,
        password: credentials.password
      }
    });

    const [resources, health] = await Promise.all([
      client.get('/rest/system/resource', {
        auth: {
          username: credentials.username,
          password: credentials.password
        }
      }),
      client.get('/rest/system/health', {
        auth: {
          username: credentials.username,
          password: credentials.password
        }
      })
    ]);
    
    logger.log('info', 'Local authentication successful', {
      identity: response.data,
      resources: resources.data
    });

    return {
      success: true,
      data: {
        identity: response.data,
        resources: resources.data,
        health: health.data
      }
    };
  } catch (error) {
    const apiError = error as ApiError;
    logger.log('error', 'Local authentication failed', apiError);
    return {
      success: false,
      error: apiError.customMessage
    };
  }
};

export const setupPPTPConnection = async (
  credentials: PPTPCredentials
): Promise<ApiResponse> => {
  try {
    logger.log('info', 'Initiating PPTP connection setup', {
      serverAddress: credentials.serverAddress
    });

    const client = createApiClient();
    
    // Verify router access first
    await client.get('/rest/system/identity', {
      auth: {
        username: credentials.username,
        password: credentials.password
      }
    });

    // Configure PPTP client with correct property names
    const pptpConfig = {
      name: credentials.tunnelName || 'pptp-out1',
      connectTo: credentials.serverAddress,
      user: credentials.username,
      password: credentials.password,
      disabled: 'no',
      addDefaultRoute: 'yes',
      profile: 'default-encryption'
    };

    logger.log('info', 'Checking existing PPTP interfaces');

    // Check if PPTP interface already exists
    const interfaces = await client.get('/rest/interface/pptp-client', {
      auth: {
        username: credentials.username,
        password: credentials.password
      }
    });

    let response;
    const existingInterface = interfaces.data?.find(
      (iface: any) => iface.name === pptpConfig.name
    );

    if (existingInterface) {
      logger.log('info', 'Updating existing PPTP interface', {
        name: pptpConfig.name
      });

      // Update existing interface
      response = await client.put(
        `/rest/interface/pptp-client/${existingInterface['.id']}`,
        pptpConfig,
        {
          auth: {
            username: credentials.username,
            password: credentials.password
          }
        }
      );
    } else {
      logger.log('info', 'Creating new PPTP interface', {
        name: pptpConfig.name
      });

      // Create new interface
      response = await client.post(
        '/rest/interface/pptp-client',
        pptpConfig,
        {
          auth: {
            username: credentials.username,
            password: credentials.password
          }
        }
      );
    }

    // Enable the interface if it was created/updated successfully
    if (response.data) {
      logger.log('info', 'Enabling PPTP interface');
      await client.post(
        `/rest/interface/pptp-client/enable`,
        { numbers: pptpConfig.name },
        {
          auth: {
            username: credentials.username,
            password: credentials.password
          }
        }
      );

      // Monitor interface status
      const monitorStatus = async () => {
        try {
          const status = await client.get(
            `/rest/interface/pptp-client/print`,
            {
              auth: {
                username: credentials.username,
                password: credentials.password
              }
            }
          );
          
          const interface = status.data?.find((iface: any) => iface.name === pptpConfig.name);
          if (interface) {
            logger.log('info', 'PPTP interface status', {
              name: interface.name,
              running: interface.running,
              status: interface.status
            });
          }
        } catch (error) {
          logger.log('error', 'Failed to get PPTP interface status');
        }
      };

      // Check status immediately and after 5 seconds
      await monitorStatus();
      setTimeout(monitorStatus, 5000);
    }

    logger.log('info', 'PPTP connection setup completed successfully');

    return {
      success: true,
      data: {
        interface: response.data,
        status: 'PPTP interface configured and enabled'
      }
    };
  } catch (error) {
    const apiError = error as ApiError;
    logger.log('error', 'PPTP connection setup failed', apiError);
    
    if (apiError.status === 404) {
      return {
        success: false,
        error: 'PPTP service not available on the router. Please ensure PPTP client package is installed.'
      };
    }
    return {
      success: false,
      error: apiError.customMessage || 'Failed to configure PPTP connection'
    };
  }
};