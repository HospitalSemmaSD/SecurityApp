using Microsoft.EntityFrameworkCore;

namespace SecApp.Api.Utilities
{
    public static class HttpContextExtensions
    {
        public async static Task InsertParamsHeader<T>(this HttpContext httpContext, IQueryable<T> queryable)
        {

            if (httpContext is null)
            {
                throw new ArgumentException(nameof(httpContext));
            }
            double count = await queryable.CountAsync();
            httpContext.Response.Headers.Append("TotalCount", count.ToString());
        }
    }
}
