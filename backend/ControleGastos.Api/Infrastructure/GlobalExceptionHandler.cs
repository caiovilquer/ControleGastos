using ControleGastos.Api.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Infrastructure;

// Centraliza o mapeamento de exceções de negócio para status HTTP,
// evitando try/catch repetido em cada controller.
public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        var (statusCode, title) = exception switch
        {
            RecursoNaoEncontradoException => (StatusCodes.Status404NotFound, "Recurso não encontrado"),
            RegraDeNegocioException => (StatusCodes.Status422UnprocessableEntity, "Violação de regra de negócio"),
            _ => (StatusCodes.Status500InternalServerError, "Erro interno do servidor")
        };

        if (statusCode == StatusCodes.Status500InternalServerError)
        {
            _logger.LogError(exception, "Erro não tratado ao processar a requisição");
        }

        var problemDetails = new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            // Mensagem livre da exceção; exceções não previstas usam um texto
            // genérico para não vazar stack trace ou detalhes internos.
            Detail = statusCode == StatusCodes.Status500InternalServerError
                ? "Ocorreu um erro inesperado ao processar a requisição."
                : exception.Message
        };

        httpContext.Response.StatusCode = statusCode;
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true;
    }
}
