namespace ControleGastos.Api.Exceptions;

// Mapeada para 422 pelo IExceptionHandler global.
public class RegraDeNegocioException : Exception
{
    public RegraDeNegocioException(string message) : base(message)
    {
    }
}
