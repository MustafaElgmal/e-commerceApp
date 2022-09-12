/* This example requires Tailwind CSS v2.0+ */
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector } from 'redux/app/hookes'
import { addToCart, removeFromCart } from 'redux/features/cartSlice'
import { CartItem, ProductWithExtra} from 'types'
import Dropdown from './dropdown'

// export const getStaticProps=()=>{
//   let availableQty=getAvailableQty()
//   return {
//     props:{availableQty}
//   }
// }

type props = {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function ShoppingCartDrawer({ open, setOpen }: props) {
  const cart = useAppSelector((state) => state.cart.orders)
  const router=useRouter()
  const [supTotal, setSupTotal] = useState<number>()
  const dispatch = useDispatch()
  const removeItemFromCart = (product: CartItem) => {
    dispatch(removeFromCart(product))
    if (cart.length === 1) {
      setOpen(false)
      router.push('/')
    }
  }
  const calcSupTotal = () => {
    let sum = 0
    cart.forEach(
      (product) => (sum += parseInt(product.price) * product.quantity)
    )
    setSupTotal(sum)
  }
  const getAvailableQty=(product:ProductWithExtra)=>{
    let availableQty=0
    for(let i=0;i<product.variants.length;i++){
      availableQty+=parseInt(product.variants[i].Qty)
    }
  
    return Array.from(
      Array(availableQty),
      (_, i) => i + 1
    )
  }

  useEffect(() => {
    calcSupTotal()
  }, [cart])
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          {' '}
                          Shopping cart{' '}
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul
                            role="list"
                            className="-my-6 divide-y divide-gray-200"
                          >
                            {cart.map((product) => (
                              <li key={product.id} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img
                                    src={product.images[0].imageSrc}
                                    alt={product.images[0].imageAlt}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3 onClick={() => setOpen(false)}>
                                        <Link href={`/product/${product.id}`}>
                                        <a >
                                          {' '}
                                          {product.name}{' '}
                                        </a>
                                        </Link>
                                      </h3>
                                      <p className="ml-1">{`$${product.price}`}</p>
                                    </div>
                                    <div className="mt-1 flex text-sm">
                                      <p className="text-gray-500">
                                        {product.color}
                                      </p>
                                      {product.size ? (
                                        <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
                                          {product.size}
                                        </p>
                                      ) : null}
                                    </div>
                                   
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <p className="text-gray-500">
                                      <Dropdown
                                        onChange={(value) => {
                                          dispatch(
                                            addToCart({
                                              ...product,
                                              quantity: parseInt(value),
                                            })
                                          )
                                        }}
                                        values={getAvailableQty(product)}
                                        defaultValue={product.quantity}
                                      />
                                    </p>

                                    <div className="flex">
                                      <button
                                        type="button"
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                        onClick={() =>
                                          removeItemFromCart(product)
                                        }
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>{`$${supTotal}`}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Shipping and taxes calculated at checkout.
                      </p>
                      <div className="mt-6">
                        <Link href="/checkout">
                          <button
                            className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                            style={{ width: '100%' }}
                          >
                            Checkout
                          </button>
                        </Link>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or{' '}
                          <button
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                            onClick={() => setOpen(false)}
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
