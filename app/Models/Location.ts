import { DateTime } from 'luxon'
import { 
  BaseModel, 
  column ,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
  computed
} from '@ioc:Adonis/Lucid/Orm'

export default class Location extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column({ serializeAs: null })
  public parentId: number

  @belongsTo(() => Location, {
    foreignKey: 'parentId',
  })
  public parentLocation: BelongsTo<typeof Location>

  @hasMany(() => Location, {
    foreignKey: 'parentId',
  })
  public subLocations: HasMany<typeof Location>
  
  @column.dateTime({ 
    autoCreate: true,
    serialize: (value: DateTime | null) => {
      return value ? value.setZone('utc').toISO() : value
    },
   })
  public createdAt: DateTime

  @column.dateTime({ 
    autoCreate: true, 
    autoUpdate: true,
    serialize: (value: DateTime | null) => {
      return value ? value.setZone('utc').toISO() : value
    }, 
  })
  public updatedAt: DateTime
}
