using ControleGastos.Api.DTOs;

namespace ControleGastos.Api.Services;

// Sem ExcluirAsync: o desafio pede apenas criação e listagem de transações.
public interface ITransacaoService
{
    Task<IReadOnlyCollection<TransacaoResponse>> ListarAsync(CancellationToken cancellationToken);

    // Extra além do requisito mínimo: útil para a tela de detalhe de uma pessoa.
    Task<IReadOnlyCollection<TransacaoResponse>> ListarPorPessoaAsync(int pessoaId, CancellationToken cancellationToken);

    // Lança RecursoNaoEncontradoException quando o id não existe; o handler
    // global converte para 404, então o retorno nunca é nulo.
    Task<TransacaoResponse> ObterPorIdAsync(int id, CancellationToken cancellationToken);

    // Valida aqui, no service, a regra de negócio de que menores de 18 anos
    // só podem registrar despesas — validação de formato fica no FluentValidation.
    Task<TransacaoResponse> CriarAsync(CriarTransacaoRequest request, CancellationToken cancellationToken);
}
