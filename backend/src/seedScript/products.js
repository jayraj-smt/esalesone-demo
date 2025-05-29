import db from '../models'

const productsMockData = [
  {
    title: 'Converse Chuck Taylor All Star II Hi',
    description:
      'High top canvas sneakers with improved cushioning and premium materials.',
    price: 75.0,
    // imageUrl: 'https://via.placeholder.com/300x300.png?text=Converse+High',
    images: [
      {
        imageUrl:
          'https://makis-store.gr/wp-content/uploads/2017/05/150143c2.jpg',
        variant: 'Black',
      },
      {
        imageUrl:
          'https://image-raw.reversible.com/raw_images/f15b60b61a783033d1ed9d28ad7c744710f68ccabe87dba20a81ccfbd04f96fe',
        variant: 'Navy',
      },
      {
        imageUrl:
          'https://www.superkicks.in/cdn/shop/files/1_151e5aae-ff42-4900-8548-1fedb2d5d864.jpg?v=1728552976',
        variant: 'Grey',
      },
    ],
    // variants: ['Black', 'Grey', 'Navy'],
    inventoryCount: 100,
  },
  {
    title: 'Nike Air Max 270',
    description:
      'Breathable mesh upper with a large Max Air unit for comfort all day long.',
    price: 150.0,
    images: [
      {
        imageUrl:
          'https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/cb1951e7-0600-4f7a-9b26-12be8cd2bd01/W+AIR+MAX+270.png',
        variant: 'Black',
      },
      {
        imageUrl:
          'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/2fb74645-8a41-4316-a1fa-2f2433611880/W+AIR+MAX+270.png',
        variant: 'Pink',
      },
      {
        imageUrl:
          'https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/pyyixbczj6u5kiwhpjik/W+AIR+MAX+270.png',
        variant: 'White',
      },
    ],
    // variants: ['Black', 'Pink', 'White'],
    inventoryCount: 80,
  },
  {
    title: 'Adidas Ultraboost 22',
    description:
      'Energy-returning running shoes with Primeknit upper and responsive cushioning.',
    price: 180.0,
    images: [
      {
        imageUrl:
          'https://golfism.in/cdn/shop/files/1_297577a9-152d-4c4e-95c7-d3c6ec5c7e48.png?v=1720256506',
        variant: 'Black',
      },
      {
        imageUrl:
          'https://cdn.fleetfeet.com/a:1.3333333333333-f:cover-w:1200/assets/adidasultraboost.jpeg?s=ae640b72',
        variant: 'Blue',
      },
    ],
    // variants: ['Black', 'Blue'],
    inventoryCount: 60,
  },
  {
    title: 'Vans Old Skool',
    description:
      'Classic skate shoes with side stripe and durable suede/canvas upper.',
    price: 60.0,
    images: [
      {
        imageUrl:
          'https://commonground.ph/cdn/shop/files/VansSkateOldSkool_black_white3.jpg?v=1702972081',
        variant: 'Black',
      },
      {
        imageUrl:
          'https://static.flexdog.com/flexdog-b/products/images/71399c56-c9d2-4a4f-9b0a-d146eb8f6b0b_imager.jpeg?width=828&quality=40',
        variant: 'Checkered',
      },
    ],
    // variants: ['Black', 'Checkered'],
    inventoryCount: 120,
  },
  {
    title: 'Puma RS-X3',
    description: 'Bold streetwear sneakers with extreme design and comfort.',
    price: 110.0,
    images: [
      {
        imageUrl:
          'https://rukminim2.flixcart.com/image/850/1000/xif0q/shoe/r/g/p/-original-imah4a9w42vkna7h.jpeg?q=90&crop=false',
        variant: 'Multicolor',
      },
      {
        imageUrl:
          'https://images-cdn.ubuy.co.in/6558687301669b30391302f3-puma-rs-x3-level-up.jpg',
        variant: 'White',
      },
    ],
    // variants: ['Multicolor', 'White'],
    inventoryCount: 90,
  },
]

// export const addProducts = async () => {
//   try {
//     console.log('Seeding products...')

//     await db.sequelize.sync()
//     console.log('Database synchronized successfully')

//     await db.Product.destroy({ where: {} })

//     await db.Product.bulkCreate(productsMockData)

//     console.log('Products seeded successfully')
//   } catch (error) {
//     console.error('Error seeding products:', error)
//   } finally {
//     await db.sequelize.close()
//   }
// }

export const addProducts = async () => {
  try {
    console.log('Seeding products and images...')

    await db.sequelize.sync()
    console.log('Database synchronized')

    await db.ProductImage.destroy({ where: {} }, { truncate: true })
    await db.Product.destroy({ where: {} }, { truncate: true })

    for (const productData of productsMockData) {
      const { images, ...productFields } = productData

      // Create product
      const product = await db.Product.create(productFields)

      // Create associated images
      const imageRecords = images.map((img) => ({
        productId: product.id,
        imageUrl: img?.imageUrl,
        variant: img?.variant,
      }))

      await db.ProductImage.bulkCreate(imageRecords)
    }

    console.log('Products and images seeded successfully')
  } catch (error) {
    console.error('Error seeding products:', error)
  } finally {
    await db.sequelize.close()
  }
}

addProducts()
