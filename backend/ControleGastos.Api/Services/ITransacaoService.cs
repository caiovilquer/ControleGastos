using ControleGastos.Api.DTOs;

namespace ControleGastos.Api.Services;

public interface ITransacaoService
{
    Task<IReadOnlyCollection<TransacaoResponse>> ListarAsync(CancellationToken cancellationToken);

    Task<IReadOnlyCollection<TransacaoResponse>> ListarPorPessoaAsync(int pessoaId, CancellationToken cancellationToken);

    Task<TransacaoResponse> ObterPorIdAsync(int id, CancellationToken cancellationToken);

    // Menores de 18 só despesa — formato fica no FluentValidation.
    Task<TransacaoResponse> CriarAsync(CriarTransacaoRequest request, CancellationToken cancellationToken);
}
