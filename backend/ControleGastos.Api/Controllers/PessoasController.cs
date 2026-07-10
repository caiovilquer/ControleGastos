using ControleGastos.Api.DTOs;
using ControleGastos.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PessoasController : ControllerBase
{
    private readonly IPessoaService _pessoaService;

    public PessoasController(IPessoaService pessoaService)
    {
        _pessoaService = pessoaService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<PessoaResponse>>> Listar(CancellationToken cancellationToken)
    {
        var pessoas = await _pessoaService.ListarAsync(cancellationToken);
        return Ok(pessoas);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<PessoaResponse>> ObterPorId(int id, CancellationToken cancellationToken)
    {
        var pessoa = await _pessoaService.ObterPorIdAsync(id, cancellationToken);
        return Ok(pessoa);
    }

    [HttpPost]
    public async Task<ActionResult<PessoaResponse>> Criar(CriarPessoaRequest request, CancellationToken cancellationToken)
    {
        var pessoa = await _pessoaService.CriarAsync(request, cancellationToken);
        return CreatedAtAction(nameof(ObterPorId), new { id = pessoa.Id }, pessoa);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Excluir(int id, CancellationToken cancellationToken)
    {
        await _pessoaService.ExcluirAsync(id, cancellationToken);
        return NoContent();
    }
}
