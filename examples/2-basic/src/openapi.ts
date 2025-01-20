import { type OpenAPIObject } from '@sleekify/sleekify';

export const specification: OpenAPIObject = {
  openapi: '3.1.1',
  info: {
    title: 'Test API',
    version: '1.0.0'
  },
  components: {
    responses: {
      400: {
        description: 'Bad request response',
        content: {
          'application/json': {
            schema: {
              type: ['object'],
              properties: {
                status: {
                  const: 400
                },
                error: {
                  const: 'Bad Request'
                },
                message: {
                  type: ['string']
                }
              }
            }
          }
        }
      },
      401: {
        description: 'Unauthorized response',
        content: {
          'application/json': {
            schema: {
              type: ['object'],
              properties: {
                status: {
                  const: 401
                },
                error: {
                  const: 'Unauthorized'
                },
                message: {
                  type: ['string']
                }
              }
            }
          }
        }
      },
      403: {
        description: 'Forbidden response',
        content: {
          'application/json': {
            schema: {
              type: ['object'],
              properties: {
                status: {
                  const: 403
                },
                error: {
                  const: 'Forbidden'
                },
                message: {
                  type: ['string']
                }
              }
            }
          }
        }
      },
      404: {
        description: 'Not found response',
        content: {
          'application/json': {
            schema: {
              type: ['object'],
              properties: {
                status: {
                  const: 404
                },
                error: {
                  const: 'Not Found'
                },
                message: {
                  type: ['string']
                }
              }
            }
          }
        }
      },
      500: {
        description: 'Internal server error response',
        content: {
          'application/json': {
            schema: {
              type: ['object'],
              properties: {
                status: {
                  const: 500
                },
                error: {
                  const: 'Internal Server Error'
                },
                message: {
                  type: ['string']
                }
              }
            }
          }
        }
      }
    }
  }
};
