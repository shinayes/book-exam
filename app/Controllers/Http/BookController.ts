// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Book from 'App/Models/Book'

class BookController {
  /**
   * Handle the request to get all books
   */
  async index ({ response }) {
    const books = await Book.query()
    .preload('location', (locationsQuery) => {
      locationsQuery.preload('parentLocation', (parentLocationQuery) => {
        parentLocationQuery.preload('parentLocation', (locationsQuery) => {
          locationsQuery.preload('parentLocation', (parentLocationQuery) => {
            parentLocationQuery.preload('parentLocation')
          }).preload('subLocations', (subLocationsQuery) => {
            subLocationsQuery.preload('subLocations')
          })
        })
      }).preload('subLocations', (subLocationsQuery) => {
        subLocationsQuery.preload('subLocations', (locationsQuery) => {
          locationsQuery.preload('parentLocation', (parentLocationQuery) => {
            parentLocationQuery.preload('parentLocation')
          }).preload('subLocations', (subLocationsQuery) => {
            subLocationsQuery.preload('subLocations')
          })
        })
      })
    })

    return response.status(200).json(books)
  }

  /**
   * Handle the request to show a book
   */
  async show ({  params, response }) {
    const book = await Book.find(params.id)

    if (!book) {
      return response.notFound({ message: 'Book not found' })
    }

    return response.status(200).json(book)
  }

  /**
   * Handle the request to create a book
   */
  async store ({ request, response }) {
    const {
      title,
      author,
      locationId
    } = request.all()

    const book = await Book.create({
      title,
      author,
      locationId
    })

    return response.status(201).json(book)
  }

  /**
   * Handle the request to update a book
   */
  async update ({  params, request, response }) {
    const book = await Book.find(params.id)

    if (!book) {
      return response.notFound({ message: 'Book not found' })
    }

    const {
      title,
      author,
      locationId
    } = request.all()

    console.log(params);

    await book.merge({
      title,
      author,
      locationId
    }).save();

    return response.status(200).json({
      message: 'Book updated successfully.'
    })
  }

  /**
   * Handle the request to delete a book
   */
  async destroy ({  params, response }) {
    const book = await Book.find(params.id)

    if (!book) {
      return response.notFound({ message: 'Book not found' })
    }

    await book.delete()
    return response.status(200).json({
      message: 'Book deleted successfully.'
    })
  }
  
}

module.exports = BookController
