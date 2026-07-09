using ControleGastos.Api.DTOs;

namespace ControleGastos.Api.Services;

public interface IPessoaService
{
    Task<IReadOnlyCollection<PessoaResponse>> ListarAsync(CancellationToken cancellationToken);

    // Lança RecursoNaoEncontradoException quando o id não existe; o handler
    // global converte para 404, então o retorno nunca é nulo.
    Task<PessoaResponse> ObterPorIdAsync(int id, CancellationToken cancellationToken);

    Task<PessoaResponse> CriarAsync(CriarPessoaRequest request, CancellationToken cancellationToken);

    // Deleção remove as transações vinculadas em cascata (configurado no DbContext).
    // Retorna false quando a pessoa não existe, para o controller mapear 404.
    Task<bool> ExcluirAsync(int id, CancellationToken cancellationToken);
}
