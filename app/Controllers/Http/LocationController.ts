// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Location from 'App/Models/Location'

class LocationController {
  /**
   * Handle the request to get all locations
   */
  async index ({ response }) {
    const locations = await Location.query()
    .preload('subLocations', (subLocationsQuery) => {
      subLocationsQuery.preload('parentLocation')
    }).preload('parentLocation', (parentLocationQuery) => {
      parentLocationQuery.preload('parentLocation')
    })

    return response.status(200).json(locations)
  }

  /**
   * Handle the request to show a location
   */
  async show ({  params, response }) {
    const location = await Location.find(params.id)

    if (!location) {
      return response.notFound({ message: 'Location not found' })
    }

    return response.status(200).json(location)
  }

  /**
   * Handle the request to create a location
   */
  async store ({ request, response }) {
    const {
      name,
      parentId
    } = request.all()

    const location = await Location.create({
      name,
      parentId
    })

    return response.status(201).json(location)
  }

  /**
   * Handle the request to delete a book
   */
  async destroy ({  params, response }) {
    const location = await Location.find(params.id)

    if (!location) {
      return response.notFound({ message: 'Location not found' })
    }

    await location.delete()
    return response.status(200).json({
      message: 'Location deleted successfully.'
    })
  }
}

module.exports = LocationController
