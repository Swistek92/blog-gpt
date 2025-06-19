import { faker } from '@faker-js/faker'
import { setSeederFactory } from 'typeorm-extension'
import { PostEN } from '../entities/postEN.entity'

export const PostFactory = setSeederFactory(PostEN, () => {
  const post = new PostEN()

  post.title = faker.lorem.sentence()
  post.content = `<p>${faker.lorem.paragraphs(3, '</p><p>')}</p>`
  post.previewImageUrl = faker.image.urlPicsumPhotos()
  post.slug = faker.string.alphanumeric(10).toLowerCase()
  post.author_id = 1 
  post.published = true

  return post
})
