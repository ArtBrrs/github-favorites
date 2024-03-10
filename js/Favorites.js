import { GithubUser } from "./GithubUser.js"

/* Classe que vai conter a lógica dos dados  e como os dados
serão estruturardos.*/

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load() 
  }

  // Método que carrega os dados do localStorage e coloca na propriedade entries
  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  // Método que salva no localstorage
  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))    
  }

  // Método Assíncrono que adiciona um novo usuário ao array entries
  async add(username) {
    try {

      const userExists = this.entries.find(entry => entry.login === username)

      if (userExists) {
        throw new Error('Usuário já cadastrado!')
      }

      const user = await GithubUser.search(username)

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado')
      } 

      this.entries = [user, ...this.entries]          
      this.update()
      this.save()      
      

    } catch (error) {
      alert(error.message)
    }

  }

  // Método para deletar usuários do array entries
  delete(user) {
    const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

    this.entries = filteredEntries    
    this.update()
    this.save()
  }
}

/* Classe que vai criar a visualização e eventos do HTML */

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()   
    this.onadd() 
  }

  // Método que pega o valor do input depois do botão ser pressionado
  onadd() {
    const addButton = this.root.querySelector('.search button')

    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')

      this.add(value)
    }
  }

  // Atualiza a tabela a partir dos dados no array entries
  update() {
    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.createTableRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Você deseja continuar com a exclusão da linha?')

        if (isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
  }

  // Cria uma linha da tabela
  createTableRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <td class="user">
        <img src="https://github.com/ArtBrrs.png" alt="Imagem de Arthur Barreiros">
        <a href="https://github.com/ArtBrrs" target="_blank">
          <p>Arthur Barreios</p>
          <span>ArtBrrs</span>
        </a>
      </td>
      <td class="repositories">
        2
      </td>
      <td class="followers ">
        0
      </td>
      <td>
        <button class="remove">&times;</button>
      </td>    
    `

    return tr
  }

  // Limpando todas as linhas da tabela
  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove()
    })
  }
  
}
