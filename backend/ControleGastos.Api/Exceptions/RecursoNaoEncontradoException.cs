namespace ControleGastos.Api.Exceptions;

// Mapeada para 404 pelo IExceptionHandler global.
public class RecursoNaoEncontradoException : Exception
{
    public RecursoNaoEncontradoException(string message) : base(message)
    {
    }
}
