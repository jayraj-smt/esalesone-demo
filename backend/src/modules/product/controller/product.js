import { Op } from 'sequelize'

export const getProducts = async (req, res) => {
  try {
    const {
      context: {
        models: { Order, Product, ProductImage },
      },
      query: { page = 1, limit = 10, search = '' },
    } = req

    const whereClause = search
      ? {
          [Op.or]: [
            { title: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {}

    const offset = (parseInt(page) - 1) * parseInt(limit)
    const { rows: products, count: totalItems } = await Product.findAndCountAll(
      {
        where: whereClause,
        limit: parseInt(limit),
        offset,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: ProductImage,
            as: 'productImages',
            attributes: ['id', 'imageUrl', 'variant'],
          },
        ],
      }
    )

    res.status(200).json({ products, totalItems })
  } catch (error) {
    console.error('Error while fetching products:', error)
    res.status(500).json({
      error: 'Error while fetching products',
      details: error.message,
    })
  }
}
