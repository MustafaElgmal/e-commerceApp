import { StarIcon } from '@heroicons/react/solid'
import { Fragment, useState, useEffect } from 'react'
import { Dialog, Popover, RadioGroup, Tab, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  CurrencyDollarIcon,
  GlobeAmericasIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import Layout from 'components/layout'
import { classNames } from 'lib'
import { CartItem, ColorType, Product, ProductWithExtra, PropsType, SizeType } from 'types'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { Base_Url } from 'constans'
import { addToCart } from 'redux/features/cartSlice'

export const getStaticPaths = async () => {
  
    const res = await axios.get(`${Base_Url}/api/products`)
    const products: ProductWithExtra[] = res.data.products
    const paths = products.map((product:ProductWithExtra) => {
      return {
        params: { ProductId: product.id },
      }
    })
    return { paths, fallback: false }
}

export const getStaticProps = async (context: {
  params: { ProductId: string }
}) => {
  const id: string = context.params.ProductId
  const res = await axios.get(`${Base_Url}/api/products/${id}`)
  const product: ProductWithExtra = res.data.product
  return {
    props: { product },
  }
}

const reviews = {
  href: '1',
  average: 4,
  featured: [
    {
      id: 1,
      title: 'This is the best white t-shirt out there',
      rating: 5,
      content: `
        <p>I've searched my entire life for a t-shirt that reflects every color in the visible spectrum. Scientists said it couldn't be done, but when I look at this shirt, I see white light bouncing right back into my eyes. Incredible!</p>
      `,
      author: 'Mark Edwards',
      avatarSrc:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixqx=oilqXxSqey&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 2,
      title: 'Adds the perfect variety to my wardrobe',
      rating: 4,
      content: `
        <p>I used to be one of those unbearable minimalists who only wore the same black v-necks every day. Now, I have expanded my wardrobe with three new crewneck options! Leaving off one star only because I wish the heather gray was more gray.</p>
      `,
      author: 'Blake Reid',
      avatarSrc:
        'https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80',
    },
    {
      id: 3,
      title: 'All good things come in 6-Packs',
      rating: 5,
      content: `
        <p>Tasty beverages, strong abs that will never be seen due to aforementioned tasty beverages, and these Basic Tees!</p>
      `,
      author: 'Ben Russel',
      avatarSrc:
        'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ],
}


const ProductPage = ({ product }: PropsType) => {
  const [open, setOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState<ColorType>(product?.colors[0] as ColorType)
  const [selectedSize, setSelectedSize] = useState<SizeType>(product?.sizes[0] as SizeType)
  const dispatch = useDispatch()
  const addItemToCart = () => {
    dispatch(addToCart({ ...product, quantity: 1,color:selectedColor.name,size:selectedSize.name } as CartItem))
  }

  return (
    <Layout>
      <main className="pt-10 sm:pt-8 md:pt-0">
        {/* Image gallery */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
          <div className="aspect-w-3 aspect-h-4 hidden overflow-hidden rounded-lg lg:block">
            <img
              src={product?.images[0].src}
              alt={product?.images[0].alt}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
            <div className="aspect-w-3 aspect-h-2 overflow-hidden rounded-lg">
              <img
                src={product?.images[1].src}
                alt={product?.images[1].alt}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="aspect-w-3 aspect-h-2 overflow-hidden rounded-lg">
              <img
                src={product?.images[2].src}
                alt={product?.images[2].alt}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
          <div className="aspect-w-4 aspect-h-5 sm:overflow-hidden sm:rounded-lg lg:aspect-w-3 lg:aspect-h-4">
            <img
              src={product?.images[3].src}
              alt={product?.images[3].alt}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:py-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              {product?.name}
            </h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl text-gray-900">{`$${product?.price}`}</p>

            {/* Reviews */}
            <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        reviews.average > rating
                          ? 'text-gray-900'
                          : 'text-gray-200',
                        'h-5 w-5 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{reviews.average} out of 5 stars</p>
              </div>
            </div>
            <div className="mt-8 lg:col-span-5">
              {/* Color picker */}
              <div>
                <h2 className="text-sm font-medium text-gray-900">Color</h2>

                <RadioGroup
                  value={selectedColor}
                  onChange={setSelectedColor}
                  className="mt-2"
                >
                  <RadioGroup.Label className="sr-only">
                    Choose a color
                  </RadioGroup.Label>
                  <div className="flex items-center space-x-3">
                    {product?.colors.map((color) => (
                      <RadioGroup.Option
                        key={color.name}
                        value={color}
                        className={({ active, checked }) =>
                          classNames(
                            color.selectedColor,
                            active && checked ? 'ring ring-offset-1' : '',
                            !active && checked ? 'ring-2' : '',
                            'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none'
                          )
                        }
                      >
                        <RadioGroup.Label as="span" className="sr-only">
                          {color.name}
                        </RadioGroup.Label>
                        <span
                          aria-hidden="true"
                          className={classNames(
                            color.bgColor,
                            'h-8 w-8 rounded-full border border-black border-opacity-10'
                          )}
                        />
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Size picker */}
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-gray-900">Size</h2>
                  <a
                    href="#"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    See sizing chart
                  </a>
                </div>

                <RadioGroup
                  value={selectedSize}
                  onChange={setSelectedSize}
                  className="mt-2"
                >
                  <RadioGroup.Label className="sr-only">
                    Choose a size
                  </RadioGroup.Label>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                    {product?.sizes.map((size) => (
                      <RadioGroup.Option
                        key={size.name}
                        value={size}
                        className={({ active, checked }) =>
                          classNames(
                            size.inStock
                              ? 'cursor-pointer focus:outline-none'
                              : 'cursor-not-allowed opacity-25',
                            active
                              ? 'ring-2 ring-indigo-500 ring-offset-2'
                              : '',
                            checked
                              ? 'border-transparent bg-indigo-600 text-white hover:bg-indigo-700'
                              : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50',
                            'flex items-center justify-center rounded-md border py-3 px-3 text-sm font-medium uppercase sm:flex-1'
                          )
                        }
                        disabled={!size.inStock}
                      >
                        <RadioGroup.Label as="span">
                          {size.name}
                        </RadioGroup.Label>
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>

            <button
              className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => addItemToCart()}
            >
              Add to bag
            </button>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pb-16 lg:pr-8">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p className="text-base text-gray-900">
                  {product?.description}
                </p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">Highlights</h3>

              <div className="mt-4">
                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                  {product?.highlights.split(',').map((highlight) => (
                    <li key={highlight} className="text-gray-400">
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <section aria-labelledby="shipping-heading" className="mt-10">
              <h2
                id="shipping-heading"
                className="text-sm font-medium text-gray-900"
              >
                Details
              </h2>

              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">{product?.details}</p>
              </div>
            </section>
          </div>

          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            {/* Reviews */}
            <section
              aria-labelledby="reviews-heading"
              className="border-t border-gray-200 pt-10 lg:pt-16"
            >
              <h2 id="reviews-heading" className="sr-only">
                Reviews
              </h2>

              <div className="space-y-10">
                {reviews.featured.map((review) => (
                  <div key={review.id} className="flex flex-col sm:flex-row">
                    <div className="order-2 mt-6 sm:mt-0 sm:ml-16">
                      <h3 className="text-sm font-medium text-gray-900">
                        {review.title}
                      </h3>
                      <p className="sr-only">{review.rating} out of 5 stars</p>

                      <div
                        className="mt-3 space-y-6 text-sm text-gray-600"
                        dangerouslySetInnerHTML={{ __html: review.content }}
                      />
                    </div>

                    <div className="order-1 flex items-center sm:flex-col sm:items-start">
                      <img
                        src={review.avatarSrc}
                        alt={`${review.author}.`}
                        className="h-12 w-12 rounded-full"
                      />

                      <div className="ml-4 sm:ml-0 sm:mt-4">
                        <p className="text-sm font-medium text-gray-900">
                          {review.author}
                        </p>
                        <div className="mt-2 flex items-center">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <StarIcon
                              key={rating}
                              className={classNames(
                                review.rating > rating
                                  ? 'text-gray-900'
                                  : 'text-gray-200',
                                'h-5 w-5 flex-shrink-0'
                              )}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default ProductPage
