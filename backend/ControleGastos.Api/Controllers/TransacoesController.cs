using ControleGastos.Api.DTOs;
using ControleGastos.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers;

// Sem DELETE: o desafio pede apenas criação e listagem de transações.
[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly ITransacaoService _transacaoService;

    public TransacoesController(ITransacaoService transacaoService)
    {
        _transacaoService = transacaoService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<TransacaoResponse>>> Listar(CancellationToken cancellationToken)
    {
        var transacoes = await _transacaoService.ListarAsync(cancellationToken);
        return Ok(transacoes);
    }

    [HttpGet("pessoa/{pessoaId:int}")]
    public async Task<ActionResult<IReadOnlyCollection<TransacaoResponse>>> ListarPorPessoa(int pessoaId, CancellationToken cancellationToken)
    {
        var transacoes = await _transacaoService.ListarPorPessoaAsync(pessoaId, cancellationToken);
        return Ok(transacoes);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TransacaoResponse>> ObterPorId(int id, CancellationToken cancellationToken)
    {
        var transacao = await _transacaoService.ObterPorIdAsync(id, cancellationToken);
        return Ok(transacao);
    }

    [HttpPost]
    public async Task<ActionResult<TransacaoResponse>> Criar(CriarTransacaoRequest request, CancellationToken cancellationToken)
    {
        var transacao = await _transacaoService.CriarAsync(request, cancellationToken);
        return CreatedAtAction(nameof(ObterPorId), new { id = transacao.Id }, transacao);
    }
}
