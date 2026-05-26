import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    // 1. Recebe os dados que vieram da página do navegador
    const body = await req.json();
    const historicoEstagio = body.historico;

    if (!historicoEstagio) {
      return NextResponse.json(
        { erro: "Nenhum histórico foi enviado para a IA." },
        { status: 400 }
      );
    }

    // 2. Verificar e inicializar o SDK do Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { erro: "Configuração da API do Gemini ausente no servidor." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // 3. Estruturar o prompt
    const prompt = `
      Você é um assistente de escrita acadêmica de alto nível, especializado em relatórios finais de estágio supervisionado de licenciatura.
      Com base nos registros diários de observação fornecidos abaixo, elabore um relatório de estágio oficial, formal, fluido, utilizando a norma-padrão da língua portuguesa e estritamente em terceira pessoa (linguagem impessoal).
      
      O documento final gerado deve ser amplo, detalhado e estruturado obrigatoriamente nas seguintes seções:
      1. INTRODUÇÃO (Apresentação do estágio e contextualização dos ambientes e turmas observadas)
      2. ANÁLISE DO PROCESSO DE ENSINO E APRENDIZAGEM (Agrupamento e reflexão crítica sobre aspectos metodológicos e conteúdos ministrados em sala/quadro)
      3. GESTÃO DE SALA DE AULA E DINÂMICA ESCOLAR (Reflexão sobre gerenciamento de turma, comportamento dos alunos e clima pedagógico)
      4. INCLUSÃO E DIVERSIDADE NO CONTEXTO ESCOLAR (Análise de práticas inclusivas e tratamento de alunos com necessidades específicas)
      5. INFRAESTRUTURA E AMBIENTE INSTITUCIONAL (Análise dos espaços escolares observados, como biblioteca, murais informativos, organização física e administrativa)
      6. CONSIDERAÇÕES FINAIS (Conclusão do relatório com uma reflexão crítica sobre os impactos da observação na sua futura prática docente)

      Importante: Forneça a resposta formatada estritamente em Markdown (com títulos #, ##, listas e negritos) para manter uma estrutura profissional.

      Aqui estão as observações reais coletadas no campo de estágio:
      ${historicoEstagio}
    `;

    // 4. Solicitar a geração do texto completo à IA
    const result = await model.generateContent(prompt);
    const relatorioGerado = result.response.text();

    return NextResponse.json({ relatorio: relatorioGerado });
  } catch (error: any) {
    console.error("Erro interno no processamento da IA:", error);
    return NextResponse.json(
      { erro: "Ocorreu um erro interno ao processar o relatório com a inteligência artificial." },
      { status: 500 }
    );
  }
}