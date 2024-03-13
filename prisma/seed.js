const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
  await prisma.enrollments.deleteMany();
  await prisma.user.deleteMany();
  await prisma.activity.deleteMany();

  const passwordCarlos = await bcrypt.hash('batatadoce', 10);
  const passwordPedro = await bcrypt.hash('123456', 10);

  await prisma.user.createMany({
    data: [
      {
        email: 'carlosdf035@gmail.com',
        name: 'carlos',
        password:  passwordCarlos,
        role: 'ADMIN',
        accredited: true,
      },
      {
        email: 'pedroaugennes@gmail.com',
        name: 'Maromba',
        password: passwordPedro,
        role: 'ADMIN',
        accredited: true,
      },
    ],
  });

  const day18 = "2024-03-18T00:00:00.000Z";
  const day19 = "2024-03-19T00:00:00.000Z";
  const day20 = "2024-03-20T00:00:00.000Z";
  const day21 = "2024-03-21T00:00:00.000Z";
  const defaultUrl = "user.svg"

  const coffeeBreak = ({date, startTime, endTime}) => {
      return { "picUrl": "", "title": "🧁 Coffee Break", "description": "", "speakers": "unknown", "location": "", "capacity": 100, "date": date, "startTime": startTime, "endTime": endTime, "type": "OTHER" }
  }

  await prisma.activity.createMany({
    data: [
      { "picUrl": "", "title": "🚩 Sessão de Abertura", "description": "", "speakers": "unknown", "location": "Sala 1", "capacity": 100, "date": day18, "startTime": "9:00", "endTime": "9:30", "type": "OTHER" },


      { "picUrl": "/dia18/renato_henriques.jpeg", "title": "Geologia e a Sociedade", "description": "A geologia está intimamente ligada ao desenvolvimento da espécie humana, especialmente a utilização de tecnologia. O curso da história foi sempre influenciado pela disponibilidade e capacidade de transformação de materiais geológicos. Atualmente colocam-se novos desafios ambientais que implicam a criação de mudanças ou “transições” salientando-se, em especial, a transição energética e a transição na mobilidade", "date": day18, "startTime": "9:30", "endTime": "10:00", "location": "Campus Gualtar, CP2 - Auditório B1", "capacity": 100, "speakers": "Renato Henriques", "type": "TALK" },


      coffeeBreak({date: day18, startTime: "10:30", endTime: "11:00"}),

      { "picUrl": "/dia18/Cassoni.jpeg", "title": "Valorização de resíduos agrícolas no contexto da economia circular: o caso da lenhina", "description": "A agricultura gera anualmente milhões de toneladas de resíduos que são descartados gerando vários problemas ambientais e económicos. Muitos destes resíduos são lenhocelulósicos, ou seja, compostos por celulose, hemicelulose e lenhina. Enquanto as frações da celulose e hemicelulose têm sido mais estudadas e valorizadas, a lenhina ainda é considerada uma fração de baixo valor.", "date": day18, "startTime": "11:00", "endTime": "12:00", "location": "Campus Gualtar, CP2 - Auditório B1", "capacity": 100, "speakers": "Carolina Cassoni", "type": "TALK" },

      { "picUrl": "/dia18/Bruno_Jardim.jpeg", "title": "Python Básico", "description": "Explore os princípios fundamentais da programação com nosso Workshop de Python Básico. Aprenda os conceitos essenciais em um ambiente didático e acessível. Sem pré-requisitos necessários - inscreva-se agora para dar os primeiros passos na linguagem de programação Python.", "date": day18, "startTime": "14:00", "endTime": "15:30", "location": "Campus Gualtar - CP7, A2 (piso 1)", "capacity": 60, "speakers": "Bruno Jardim (NECC)", "type": "WORKSHOP" },


      { "picUrl": "/dia18/Pedro_Martins.jpg", "title": "Development of new materials for environmental remediation applications", "description": "Aprenda sobre o desenvolvimento de novos materiais e suas aplicações práticas na resolução de desafios ambientais.", "date": day18, "startTime": "14:00", "endTime": "15:30", "location": "IB-S | 5° Piso", "capacity": 50, "speakers": "Pedro Martins", "type": "WORKSHOP" },

      // TODO: Foto do Pedro Gomes
      { "picUrl": defaultUrl, "title": "Ciência cidadã", "description": "", "date": day18, "startTime": "14:00", "endTime": "15:30", "location": "", "capacity": 55, "speakers": "Pedro Gomes", "type": "WORKSHOP" },

      { "picUrl": "/dia18/Filipe_Rocha.jpg", "title": "Computer Aided Drug Discovery", "description": "Throughout history, humans used herbs and traditional medicine. Technology identified healing molecules, initiating their use in treatments. Computational tools now predict molecule-target affinity, aiding drug discovery. This workshop introduces molecular visualization and computational tools for drug discovery.", "date": day18, "startTime": "14:00", "endTime": "15:30", "location": "Campus Gualtar - CP6, Auditório ECUM", "capacity": 50, "speakers": "Filipe Rocha", "type": "WORKSHOP" },


      coffeeBreak({date: day18, startTime: "15:30", endTime: "16:00"}),


      { "picUrl": "/dia18/renatogonalves.jpg", "title": "Armazenamento de Energia e futuro da mobilidade elétrica - ESM", "description": "Junta-te a nós para conheceres este grupo do Centro de Química da ECUM. Com duas apresentações em formato de palestra de cerca de 30min onde vêm falar um pouco dos projetos que estão a desenvolver.", "date": day18, "startTime": "16:00", "endTime": "16:30", "location": "Campus Gualtar, CP2 - Auditório B2", "capacity": 100, "speakers": "Renato Gonçalves", "type": "TALK" },
      { "picUrl": "/dia18/DANIELACORREIA.jpg", "title": "Materiais multifuncionais para sensores e atuadores - ESM", "description": "Junta-te a nós para conheceres este grupo do Centro de Química da ECUM. Com duas apresentações em formato de palestra de cerca de 30min onde vêm falar um pouco dos projetos que estão a desenvolver.", "date": day18, "startTime": "16:30", "endTime": "17:00", "location": "Campus Gualtar, CP2 - Auditório B2", "capacity": 100, "speakers": "Daniela Correia", "type": "TALK" },

      { "picUrl": "/dia18/Ana_Hilario.png", "title": "Tertúlia - Exploração de Recursos em Portugal", "description": "Junta-te a nós numa conversa sobre a Exploração de Recursos em Portugal, com a Ana Hilário, PhD em Ciência da Terra e do Oceano e com o Júlio Santos, formado na Universidade do Porto trabalha atualmente como Gerente da STONESET Quarry.", "date": day18, "startTime": "17:00", "endTime": "18:30", "location": "Campus Gualtar - CP2, Auditório B1", "capacity": 100, "speakers": "Júlio Santos, Ana Hilário, Rui Moura", "type": "TALK" },

      { "picUrl": "", "title": "🤔 Quizz - DR. WHY", "description": "Junta-te a nós e vem mostrar a tua sabedoria! Traz os teus amigos, forma uma equipa e mostra o teu conhecimento num QUIZZ temático da SCI. Inscreve-te no linktree na página do Instagram da SCI!", "date": day18, "startTime": "21:00", "endTime": "23:30", "location": "Carpe", "capacity": 100, "speakers": "unknown", "type": "OTHER" },


      // ------------------------------ Dia 19 ------------------------------


      { "picUrl": "/dia19/David_Machado.jpeg", "title": "Let's make a Website!", "description": "Neste workshop vai ser abordado o mundo web, onde os alunos poderão perceber como se constroi um website de raiz sem recorrer a templates. O workshop estará indicado para alunos que nunca tenham estado em contacto com  o mundo do desenvolvimento web.", "date": day19, "startTime": "9:00", "endTime": "11:00", "location": "Campus Gualtar - CP2, 2.09", "capacity": 54, "speakers": "David Machado (NECC)", "type": "WORKSHOP" },
      { "picUrl": "/dia19/Ligia_Pinto.jpg", "title": "Economia circular", "description": "Uma visão geral dos princípios e objetivos da economia circular, incluindo minimização de resíduos, maximização da eficiência de recursos, e redução do impacto ambiental.", "date": day19, "startTime": "9:00", "endTime": "11:00", "location": "Campus Gualtar - CP2, 2.02", "capacity": 55, "speakers": "Lígia Pinto", "type": "WORKSHOP" },
      { "picUrl": "/dia19/JoanaRodrigues.jpeg", "title": "Comunicar Ciência sem Preconceitos", "description": "Uma visão geral do papel fundamental que a comunicação desempenha na ciência, incluindo a importância de comunicar descobertas, resultados de pesquisa e questões científicas de forma clara, acessível e relevante.", "date": day19, "startTime": "9:00", "endTime": "11:00", "location": "Campus Gualtar - CP2, 2.08", "capacity": 55, "speakers": "Joana Rodrigues", "type": "WORKSHOP" },
      { "picUrl": defaultUrl, "title": "Remediação Ambiental", "description": "", "date": day19, "startTime": "9:00", "endTime": "11:00", "location": "", "capacity": 50, "speakers": "", "type": "OTHER" },


      coffeeBreak({date: day19, startTime: "11:00", endTime: "11:30"}),


      { "picUrl": "/dia19/Joao_Silva.png", "title": "Sustainable Chemistry", "description": "New Methods and Materials Transparent and conductive silk films for application in thermotropic and eletrochemical devices", "date": day19, "startTime": "11:30", "endTime": "12:00", "location": "Campus Gualtar - CP2, Auditório B2", "capacity": 100, "speakers": "João Silva", "type": "TALK" },

      { "picUrl": "/dia19/Susana_Costa.jpg", "title": "Aditivos alimentares: Como identificá-los?", "description": "Neste workshop será feita a identificação de aditivos alimentares em produtos como bebidas energéticas, suplementos para desportistas, entre outros, pela análise qualitativa e quantitativa através das técnicas de absorção no UV-visível e fluorescência. O workshop será totalmente prático em laboratório, com os participantes organizados em grupos e com recurso a instrumentação de espetroscopia.", "date": day19, "startTime": "14:00", "endTime": "15:30", "location": "Campus Gualtar - CP6, Laboratório 1.29", "capacity": 10, "speakers": "Susana Costa", "type": "WORKSHOP" },
      { "picUrl": "/dia19/Paula_Sampaio.png", "title": "The One Health Concept", "description": "Human migration can introduce new fungal species to different regions, affecting human and animal health. Climate change further complicates this dynamic by facilitating fungal adaptation and exacerbating the challenge of antifungal resistance. This underscores the interconnectedness of human, animal, and environmental health within the One Health concept. The rise in immunocompromised individuals has led to an increase in invasive fungal infections, including those caused by Candida species, in which the multi-resistant C. auris is an example.", "date": day19, "startTime": "14:00", "endTime": "15:00", "location": "Campus Gualtar, CP2 - Auditório B1", "capacity": 100, "speakers": "Paula Sampaio", "type": "TALK" },
      coffeeBreak({date: day19, startTime: "15:00", endTime: "15:30"}),

      { "picUrl": "/dia19/Fernanda_Proença.jpg", "title": "Alguns desafios da Química: Dos fármacos aos nanomateriais", "description": "Tudo o que nos rodeia é formado por átomos e moléculas. As propriedades das substâncias e dos materiais estão intimamente relacionadas com a sua estrutura e a capacidade de preparar e modificar estas moléculas é essencial para ajustar o seu comportamento. A Química permite-nos enfrentar estes desafios e controlar algumas destas transformações.", "date": day19, "startTime": "15:30", "endTime": "16:30", "location": "Campus Gualtar, CP2 - Auditório B1", "capacity": 100, "speakers": "Fernanda Proença", "type": "TALK" },

      { "picUrl": "/dia19/Catarina_Loureiro.jpeg", "title": "Problemas com a comunicação científica", "description": 'Junta-te a nós numa conversa sobre Comunicação Científica , com a Catarina Loureiro (estóriascomciência), com o Jorge Oliveira detentores da rúbrica "Comunicar Ciência" na rádio Antena Minho que conta já com 3 temporadas, e com o Vitor Ribeiro Cofundador e CTO do Publed, Mestre em Engenharia Eletrónica Industrial e Computadores pela Universidade do Minho', "date": day19, "startTime": "16:30", "endTime": "18:00", "location": "Campus Gualtar - CP2, Auditório B1", "capacity": 100, "speakers": "Vítor Ribeiro, Catarina Loureiro, Jorge Dinis Oliveira", "type": "TALK" },


      // ------------------------------------ Dia 20 ------------------------------------

      // TODO: Jordão e DST group speakers and photos
      { "picUrl": "/dia20/dstGroup.png", "title": "O Sistema de Inovação na dstgroup: Construindo um Futuro Sustentável", "description": "Junte-se a nós para explorar o Sistema de Inovação na dstgroup e seu papel crucial na construção de um futuro sustentável. Descubra como a inovação impulsiona nossas iniciativas de sustentabilidade, desde o desenvolvimento de novas tecnologias até a implementação de práticas empresariais responsáveis. Inscreva-se agora para participar desta conversa inspiradora sobre o papel da inovação na promoção da sustentabilidade.", "date": day20, "startTime": "9:00", "endTime": "11:00", "location": "Campus Gualtar - CP2, 2.06", "capacity": 55, "speakers": "Ana Luísa Pereira", "type": "WORKSHOP" },
      { "picUrl": "/dia20/jordao.jpg", "title": "Hidroponia e a Sunflower", "description": "Descubra como a tecnologia e o cultivo sustentável se unem para criar soluções inovadoras em espaços urbanos limitados.", "date": day20, "startTime": "9:00", "endTime": "11:00", "location": "Campus Gualtar - CP2, 2.12", "capacity": 55, "speakers": "Joana Rodrigues", "type": "WORKSHOP" },

      coffeeBreak({date: day20, startTime: "11:00", endTime: "11:30"}),

      { "picUrl": "/dia20/Bruno_Fernandes.jpg", "title": "Unlocking Key Experiences with AI", "description": "Exploring the Intersection of Physics, Emotions, and Sports", "date": day20, "startTime": "11:30", "endTime": "12:30", "location": "Campus Gualtar, CP1 - Auditório A1", "capacity": 100, "speakers": "Prof. Bruno Fernandes", "type": "TALK" },

      { "picUrl": "/dia20/ernesto_galvao.jpg", "title": "Ótica aplicada à Computação Quântica", "description": "A Computação Quântica é um campo revolucionário que utiliza os princípios da mecânica quântica para processar e armazenar informações de uma maneira completamente diferente da computação clássica. Enquanto a computação clássica utiliza bits, que representam informações como 0 ou 1, a computação quântica utiliza qubits, que podem representar simultaneamente 0, 1 ou qualquer superposição desses estados.", "date": day20, "startTime": "14:00", "endTime": "15:00", "location": "Campus Gualtar, CP1 - Auditório A1", "capacity": 100, "speakers": "Ernesto Galvão (INL)", "type": "TALK" },
      coffeeBreak({date: day20, startTime: "15:00", endTime: "15:30"}),

      { "picUrl": "/dia20/ana_neri.jpg", "title": "Quantum error correction / mitigation", "description": "Junta-te a nós no dia 20 de Março para conheceres o Grupo INESC TEC (Institute for Systems and Computer Engineering, Technology and Science). Com duas apresentações em formato de palestra de cerca de 30min onde vêm falar um pouco dos projetos que estão a desenvolver.", "date": day20, "startTime": "15:30", "endTime": "16:00", "location": "Campus Gualtar - CP1, Auditório A1", "capacity": 100, "speakers": "Ana Neri (INESC TEC)", "type": "TALK" },
      { "picUrl": "/dia20/jaime_santos.png", "title": "Quantum walks on directed and oriented graphs", "description": "Junta-te a nós no dia 20 de Março para conheceres o Grupo INESC TEC (Institute for Systems and Computer Engineering, Technology and Science). Com duas apresentações em formato de palestra de cerca de 30min onde vêm falar um pouco dos projetos que estão a desenvolver.", "date": day20, "startTime": "16:00", "endTime": "16:30", "location": "Campus Gualtar - CP1, Auditório A1", "capacity": 100, "speakers": "Jaime Santos (INESC TEC)", "type": "TALK" },

      { "picUrl": "/dia20/luis_santos.jpg", "title": "Impacto da Computação Quântica", "description": "Junta-te a nós numa conversa sobre o Impacto da Computação Quântica, com o Ernesto Galvão, formado em física pela Universidade de Oxford (PhD 2002) e pela Universidade Federal do Rio de janeiro (Mestrado 1998), com o Luís Santos Professor Auxiliar do Departamento de Informática da Universidade do Minho e investigador do INESC-TEC e com o Luís Barbosa, docente do Departamento de Informática da Universidade do Minho, investigador sénior do HASLab INESC TEC e membro do Grupo de Computação Ótica Quântica e Linear no INL.", "date": day20, "startTime": "16:30", "endTime": "18:00", "location": "Campus Gualtar - CP1, Auditório A1", "capacity": 100, "speakers": "Luís Barbosa, Ernesto Galvão (INL), Luís Santos", "type": "TALK" },
      { "picUrl": defaultUrl, "title": "🍻 RALLY", "description": "Prontos para o melhor Rally que a academia já viu? 🍻🥃 Junta-se a nós no Rally da SCI, onde equipas de 3 a 4 elementos vão percorrer os bares e lugares mais icónicos das redondezas da universidade, com shots e finos pelo caminho a partir das 22h! Por apenas 4€ por participante, esta é a oportunidade perfeita para teres uma noite inesquecível com os teus amigos e competir pelo título de melhor equipa do Rally!🏆Acede ao nosso linktree e inscreve já a tua equipa! O prémio final para os grandes vencedores? Uma garrafa de whisky para acabar bem a noite 😎", "date": day20, "startTime": "22:00", "endTime": "23:30", "location": "Braga, Universidade do Minho", "capacity": 100, "speakers": "", "type": "OTHER" },


      // ------------------------------------------- Dia 21 -------------------------------------------
      { "picUrl": "/dia21/Vinicius_Silva.png", "title": "LinkedIn e CV", "description": "Passos para criar um perfil atraente no LinkedIn, incluindo a seleção de uma foto de perfil profissional, a elaboração de um título claro e atraente, e a descrição de experiência profissional e habilidades relevantes.", "date": day21, "startTime": "10:00", "endTime": "12:00", "location": "Campus Gualtar - CP6, Auditório ECUM", "capacity": 50, "speakers": "Vinicius Silva", "type": "WORKSHOP" },
      { "picUrl": "/dia21/SofiaTeixeira.png", "title": "Chemdraw descomplicado: Iniciação ao design molecular", "description": "O Workshop ChemDraw oferece a introdução ao design/visualização molecular utilizando o software ChemDraw através de exercícios práticos.", "date": day21, "startTime": "10:00", "endTime": "12:00", "location": "Campus Gualtar - CP7, 0.05", "capacity": 20, "speakers": "André Lopes, Sofia Teixeira", "type": "WORKSHOP" },
      { "picUrl": "/dia21/Astrobiologia.png", "title": "A vida como não a conhecemos: Como descomplicar a astrobiologia?", "description": "Neste workshop vai-se começar por explicar a deteção de um exoplaneta ou dum corpo do sistema solar. Após isso irá ser distribuído pelos alunos corpos na forma de AstroDestinos de forma a que seja realizada uma atividade prática.", "date": day21, "startTime": "10:00", "endTime": "12:00", "location": "Campus Gualtar - CP2, 2.10", "capacity": 55, "speakers": "David Rodrigues, Carlos Barros, Inês Figueiredo", "type": "WORKSHOP" },
      { "picUrl": "/dia21/luis_goncalves.jpeg", "title": "Prospeção Geofísica: Aplicações Ambientais", "description": "Exploração dos diferentes métodos geofísicos utilizados para investigar o subsolo terrestre, incluindo métodos sísmicos (refração e reflexão), métodos eletromagnéticos, métodos gravimétricos e métodos de sensoriamento remoto.", "date": day21, "startTime": "10:00", "endTime": "12:00", "location": "Campus Gualtar - CP7, 0.04", "capacity": 26, "speakers": "Luís Gonçalves", "type": "WORKSHOP" },
      { "picUrl": "/dia21/mathgurl.jpg", "title": "Uma palestra sobre Ciência, Matemática e Frustração", "description": "Como que o amor e paixão por uma área científica pode impactar de forma significativa a nossa vida.", "date": day21, "startTime": "14:00", "endTime": "15:00", "location": "Campus Gualtar, CP2 - Auditório B1", "capacity": 100, "speakers": "Inês Guimarães", "type": "TALK" },

      coffeeBreak({date: day21, startTime: "15:00", endTime: "15:30"}),

      // TODO: Simão Quintela, João Matias, Filipe Vasconcelos location
      { "picUrl": "/dia21/Quintela.png", "title": "Sessão ALUMNI - Ciências da Computação", "description": "Esta sessão consiste em reunir ex-alunos de Ciências da Computação e debater temas relativos ao mesmo. Nesta sessão serão abordados temas como percurso profissional, associativismo, diferenças visíveis com o passar dos anos.", "date": day21, "startTime": "15:30", "endTime": "16:30", "location": "", "capacity": 100, "speakers": "Moderador: Simão Quintela", "type": "TALK" },
      { "picUrl": "/dia21/Joao_Matias.jpg", "title": "Sessão ALUMNI - Bioquímica", "description": "Esta sessão consiste em reunir ex-alunos de Bioquímica e debater temas relativos ao mesmo. Nesta sessão serão abordados temas como percurso profissional, associativismo, diferenças visíveis com o passar dos anos.", "date": day21, "startTime": "15:30", "endTime": "16:30", "location": "", "capacity": 100, "speakers": "Moderador: João Matias", "type": "TALK" },
      { "picUrl": "/dia21/Filipe_Vasconcelos.jpg", "title": "Sessão ALUMNI - Biologia Aplicada", "description": "Esta sessão consiste em reunir ex-alunos de Biologia Aplicada e debater temas relativos ao mesmo. Nesta sessão serão abordados temas como percurso profissional, associativismo, diferenças visíveis com o passar dos anos.", "date": day21, "startTime": "15:30", "endTime": "16:30", "location": "", "capacity": 100, "speakers": "Moderador: Filipe Vasconcelos", "type": "TALK" },




      { "picUrl": defaultUrl, "title": "Sessão com a Journal UMinho Science", "description": "Já conheces a JUS @journaluminhoscience? É uma revista científica gerida exclusivamente por alunos da ECUM com o objetivo de promover a pesquisa feita por alunos e investigadores da Universidade do Minho. 🤩 Podes também contar com uma sessão de encerramento onde vão também ser discutidos os papers submetidos por membros da revista.", "date": day21, "startTime": "16:30", "endTime": "17:30", "location": "", "capacity": 100, "speakers": "", "type": "TALK" },
      { "picUrl": defaultUrl, "title": "🏁 Sessão de Encerramento", "description": "", "speakers": "unknown", "location": "Sala 1", "capacity": 100, "date": day21, "startTime": "17:30", "endTime": "18:00", "type": "OTHER" },
      { "picUrl": defaultUrl, "title": "🍕 Pizza Night", "description": "Junta-te a nós para a tão aguardada Pizza Night, onde a pizzaria The Traditional Great Pizza irá servir fatias deliciosas por apenas 2€ por pessoa! 😋 Com direito a três senhas por participante (1 fatia = 1 senha), esta é a oportunidade perfeita para saborear pizza e conviver num ambiente descontraído e animado. Não percas esta oportunidade única e vem connosco celebrar o encerramento do melhor evento do ano! 🍕✨ Mas atenção: as vagas são limitadas a apenas 80 pessoas! Garante já o teu lugar através do nosso Linktree na bio.", "date": day21, "startTime": "18:00", "endTime": "20:30", "location": "The Traditional Great Pizza, Braga", "capacity": 100, "speakers": "unknown", "type": "OTHER" },
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });