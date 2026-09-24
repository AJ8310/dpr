from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

class HTTPSecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Applies production HTTP Security Headers to prevent clickjacking, MIME sniffing, XSS, and unauthorized iframe embedding.
    """

    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)

        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Server"] = "VKF-DPR-Studio-Engine"

        return response
