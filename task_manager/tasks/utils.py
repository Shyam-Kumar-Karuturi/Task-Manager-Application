from rest_framework.views import exception_handler
from rest_framework import status


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        # Customize error responses based on status code or exception type
        if response.status_code == status.HTTP_400_BAD_REQUEST:
            response.data = {
                'detail': 'A bad request error occurred.',
                'errors': response.data
            }
        elif response.status_code == status.HTTP_401_UNAUTHORIZED:
            response.data = {
                'detail': 'Authentication credentials were not provided or are invalid.'
            }
        elif response.status_code == status.HTTP_403_FORBIDDEN:
            response.data = {
                'detail': 'You do not have permission to perform this action.'
            }
        elif response.status_code == status.HTTP_404_NOT_FOUND:
            response.data = {
                'detail': 'The requested resource was not found.'
            }
        elif response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR:
            response.data = {
                'detail': 'An unexpected error occurred. Please try again later.'
            }

    return response
