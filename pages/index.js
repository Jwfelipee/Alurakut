import React from 'react';
import MainGrid from '../src/components/MainGrid/index.js'
import Box from '../src/components/Box/index.js'
import { ProfileRelationsBoxWrapper } from '../src/components/profileRelations'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons.js'

function ProfileSidebar(propriedades) {
  return (
    <Box >
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(propriedades) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>
      <ul>
        {/*{seguidores.map((itemAtual) => {
          return (
            <li key={itemAtual}>
              <a href={`https://github.com/${itemAtual.[0].avartar_url}`}>
                <img src={itemAtual} />
                <span>{itemAtual}</span>
              </a>
            </li>
          )
        })}*/}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {
  const githubUser = 'jwfelipee';
  const [comunidades, setComunidades] = React.useState([]);
  //const comunidades = comunidades[0];
  //const alteradorDeComunidades/setComunidades = comunidades[1];
  // const comunidades = ['Alurakut'];
  const pessoasFavoritas = [
    'wfelipe2011',
    'juunegreiros',
    'peas',
    'omariosouto',
    'rafaballerini',
    'felipefialho'
  ]

  const [seguidores, setSeguidores] = React.useState([]);
  // 0 - pegar o array de dados do github
  React.useEffect(function () {
    //-------------GET---------------//
    fetch('https://api.github.com/users/peas/followers')
      .then((respostaDoServidor) => {
        return respostaDoServidor.json();
      })
      .then((respostaConvertida) => {
        setSeguidores(respostaConvertida);
      })

    // API GraphQL - DATO CMS
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '5bbe0226d7728bb58dea9a4797075f',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        "query": `query {
        allCommunities {
          title
          id
          imageUrl
          creatorSlug
        }
      }` })
    })
      .then((response) => response.json())
      .then((respostaCompleta) => {
        const comunidadesVindoDoDato = respostaCompleta.data.allCommunities;
        console.log(comunidadesVindoDoDato);

        setComunidades(comunidadesVindoDoDato);
      })

  }, [])


  // 1 - Criar um BOx que vai ter um map, 
  // basenado nos items do array que pegamos do Github


  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box >
            <h1 className="title">
              Bem vindo(a)!
            </h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle"> O que voce deseja fazer? </h2>
            <form onSubmit={function handleSubmit(e) {
              e.preventDefault();
              const dadosForm = new FormData(e.target);

              console.log('Campo: ', dadosForm.get('title'));
              console.log('Campo: ', dadosForm.get('image'));

              const comunidade = {
                title: dadosForm.get('title'),
                imageUrl: dadosForm.get('image'),
                creatorSlug: githubUser,
              }

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(comunidade),
              })
                .then(async (response) => {
                  const dados = await response.json()
                  console.log(dados.registroCriado);
                  const comunidade = dados.registroCriado;
                  const comunidadesAtualizadas = [...comunidades, comunidade];
                  setComunidades(comunidadesAtualizadas)
                })
            }} >
              <div>
                <input placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>

              <button id="btn">
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>

        <div className="profileRealtionsArea" style={{ gridArea: 'profileRealtionsArea' }}>
          <ProfileRelationsBox title="seguidores" items={seguidores} />
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/communities/${itemAtual.id}`}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da Comunidade ({pessoasFavoritas.length})
            </h2>


            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`} >
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>

          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}
