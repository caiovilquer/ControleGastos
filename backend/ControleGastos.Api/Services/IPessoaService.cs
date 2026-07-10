using ControleGastos.Api.DTOs;

namespace ControleGastos.Api.Services;

public interface IPessoaService
{
    Task<IReadOnlyCollection<PessoaResponse>> ListarAsync(CancellationToken cancellationToken);

    Task<PessoaResponse> ObterPorIdAsync(int id, CancellationToken cancellationToken);

    Task<PessoaResponse> CriarAsync(CriarPessoaRequest request, CancellationToken cancellationToken);

    // Cascade no DbContext remove as transações vinculadas.
    Task ExcluirAsync(int id, CancellationToken cancellationToken);
}
