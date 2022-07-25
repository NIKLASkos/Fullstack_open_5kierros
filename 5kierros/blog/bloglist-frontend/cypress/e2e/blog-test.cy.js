describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.get('#username')
    cy.get('#password')
    cy.contains('Login')
    cy.get('#loginbutton')
  })

  describe('Login',function() {
    beforeEach(function() {
      const user = {
        name: 'Pseudo',
        username: 'Anonyymi',
        password: 'testi'
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user)
    })
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('Anonyymi')
      cy.get('#password').type('testi')
      cy.get('#loginbutton').click()
      cy.contains('Add a new blog')
      cy.contains('Pseudo is logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('test')
      cy.get('#password').type('wrong')
      cy.get('#loginbutton').click()
      cy.contains('wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      const user = {
        name: 'Pseudo',
        username: 'Anonyymi',
        password: 'testi'
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user)
    })

    it('A blog can be created', function() {
      cy.login({ username: 'Anonyymi', password:'testi' })
      cy.contains('Add a new blog').click()
      cy.get('#title').type('test_title')
      cy.get('#author').type('peksi_author')
      cy.get('#url').type('www.yle.fi')
      cy.contains('Add blog').click()
      cy.get('#test_title')
    })

    describe('and a note exists', function() {
      beforeEach(function() {
        cy.login({ username: 'Anonyymi', password:'testi' })
        cy.createBlog({
          title: 'test_title',
          author: 'peksi_author',
          url: 'test_url'
        })
      })

      it('A blog can be liked', function() {
        cy.get('#test_title').contains('View').click()
        cy.get('#likebutton').click()
        cy.contains('Likes: 1')
      })

      it('A blog can be deleted', function() {
        cy.get('#test_title').contains('View').click()
        cy.get('#deletebutton').click()
        //cancels delete request without cy.wait()
        cy.wait(500)
        cy.visit('http://localhost:3000')
        cy.get('html').not('test_title')
        cy.contains('Add a new blog')
      })

      it('Most liked post is on top of the page', function() {
        cy.createBlog({
          title: 'most_liked',
          author: 'peksi_author',
          url: 'test_url'
        })
        cy.createBlog({
          title: 'second_most_liked',
          author: 'peksi_author',
          url: 'test_url'
        })
        cy.get('#most_liked').contains('View').click()
        cy.get('#likebutton').click()
        cy.wait(50)
        cy.get('#likebutton').click()
        cy.contains('Hide').click()
        cy.get('#second_most_liked').contains('View').click()
        cy.get('#likebutton').click()
        cy.visit('http://localhost:3000')
        cy.wait(500)
        cy.get('.blog').eq(0).contains('most_liked')
        cy.get('.blog').eq(1).contains('second_most_liked')
        cy.get('.blog').eq(2).contains('test_title')
      })
    })
  })
})