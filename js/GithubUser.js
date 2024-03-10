// Classe que contém o método search responsável por fazer a comunicação com a api do github e retornar os dados para cadastrar no
// Array Entries 
export class GithubUser {
  static search(username) {
   const endpoint = `https://api.github.com/users/${username}`
 
   return fetch(endpoint).then(data => data.json()).then(({login, name, public_repos, followers}) => ({
     login,
     name,
     public_repos,
     followers
   }))
  }
 }
 