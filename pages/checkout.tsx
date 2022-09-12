import { RadioGroup } from '@headlessui/react'
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/solid'
import Dropdown from 'components/dropdown'
import Layout from 'components/layout'
import { useFormik } from 'formik'
import { classNames } from 'lib'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector } from 'redux/app/hookes'
import { addToCart, removeFromCart } from 'redux/features/cartSlice'
import { CartItem, InfoType, ProductWithExtra } from 'types'
import { createOrder } from 'utils/apis'
import * as Yup from 'yup'
import { useRouter } from 'next/router'

const deliveryMethods = [
  {
    id: 1,
    title: 'Standard',
    turnaround: '4–10 business days',
    price: '5.00',
  },
  { id: 2, title: 'Express', turnaround: '2–5 business days', price: '16.00' },
]
const paymentMethods = [
  { id: 'credit-card', title: 'Credit card' },
  { id: 'paypal', title: 'PayPal' },
  { id: 'etransfer', title: 'eTransfer' },
]

export default function Example() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(
    deliveryMethods[0]
  )
  const cart = useAppSelector((state) => state.cart.orders)
  const dispatch = useDispatch()

  const removeItemFromCart = (product: CartItem) => {
    dispatch(removeFromCart(product))
    if (cart.length === 1) {
      router.push('/')
    }
  }
  const [supTotal, setSupTotal] = useState<number>()
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
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      company: '',
      address: '',
      apartment: '',
      city: '',
      country: '',
      state: '',
      postalCode: '',
      deliveryMethod: selectedDeliveryMethod.title,
      cardNumber: '',
      nameOnCard: '',
      expireDate: '',
      cvc: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('FirstName is required!'),
      lastName: Yup.string().required('lastName is required!'),
      email: Yup.string()
        .email('email is not vaild!')
        .required('email is required!'),
      phoneNumber: Yup.string().required('phoneNumber is required!'),
      company: Yup.string().required('company is required!'),
      address: Yup.string().required('address is required!'),
      apartment: Yup.string().required('apartement is required!'),
      city: Yup.string().required('city is required!'),
      country: Yup.string().required('country is required!'),
      state: Yup.string().required('state is required!'),
      postalCode: Yup.string().required('postalCode is required!'),
      cardNumber: Yup.string().required('cardNumber is required!'),
      nameOnCard: Yup.string().required('nameOnCard is required!'),
      expireDate: Yup.string().required('expireDate is required!'),
      cvc: Yup.string().required('CVC is required!'),
    }),
    onSubmit: async (values) => {
      const orderItems: { productId: string; Qty: number }[] = []
      cart.forEach((product: CartItem) =>
        orderItems.push({ productId: product.id, Qty: product.quantity })
      )
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        company,
        address,
        apartment,
        city,
        country,
        state,
        postalCode,
        deliveryMethod,
      } = values
      const info: InfoType = {
        firstName,
        lastName,
        email,
        phoneNumber,
        company,
        address,
        apartment,
        city,
        country,
        state,
        postalCode,
        deliveryMethod,
      }
      if (cart.length > 0) {
        console.log({ ...info, orderItems })
        await createOrder({ ...info, orderItems },dispatch,router)
      } else {
        alert('No Product in cart!')
      }
      formik.resetForm()
    },
  })
  useEffect(() => {
    calcSupTotal()
  }, [cart])

  return (
    <Layout>
      <div className="bg-gray-50">
        <main className="mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <h1 className="sr-only">Checkout</h1>

            <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
              <div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Contact information
                  </h2>

                  <div className="mt-4">
                    <label
                      htmlFor="email-address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        id="email-address"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        autoComplete="email"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {formik.errors.email && formik.touched.email ? (
                        <p className="text-red-600/100">
                          {formik.errors.email}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="mt-10 border-t border-gray-200 pt-10">
                  <h2 className="text-lg font-medium text-gray-900">
                    Shipping information
                  </h2>

                  <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <div>
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        First name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="first-name"
                          name="firstName"
                          value={formik.values.firstName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          autoComplete="given-name"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {formik.errors.firstName && formik.touched.firstName ? (
                          <p className="text-red-600/100">
                            {formik.errors.firstName}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Last name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="last-name"
                          name="lastName"
                          value={formik.values.lastName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          autoComplete="family-name"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {formik.errors.lastName && formik.touched.lastName ? (
                          <p className="text-red-600/100">
                            {formik.errors.lastName}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Company
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="company"
                          value={formik.values.company}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          id="company"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      {formik.errors.company && formik.touched.company ? (
                        <p className="text-red-600/100">
                          {formik.errors.company}
                        </p>
                      ) : null}
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Address
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="address"
                          value={formik.values.address}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          id="address"
                          autoComplete="street-address"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {formik.errors.address && formik.touched.address ? (
                          <p className="text-red-600/100">
                            {formik.errors.address}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="apartment"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Apartment, suite, etc.
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="apartment"
                          value={formik.values.apartment}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          id="apartment"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {formik.errors.apartment && formik.touched.apartment ? (
                          <p className="text-red-600/100">
                            {formik.errors.apartment}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700"
                      >
                        City
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="city"
                          value={formik.values.city}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          id="city"
                          autoComplete="address-level2"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {formik.errors.city && formik.touched.city ? (
                          <p className="text-red-600/100">
                            {formik.errors.city}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Country
                      </label>
                      <div className="mt-1">
                        <select
                          id="country"
                          name="country"
                          value={formik.values.country}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          autoComplete="country-name"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="Mexico">Mexico</option>
                        </select>
                        {formik.errors.country && formik.touched.country ? (
                          <p className="text-red-600/100">
                            {formik.errors.country}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="region"
                        className="block text-sm font-medium text-gray-700"
                      >
                        State / Province
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="state"
                          value={formik.values.state}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          id="region"
                          autoComplete="address-level1"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {formik.errors.state && formik.touched.state ? (
                          <p className="text-red-600/100">
                            {formik.errors.state}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="postal-code"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Postal code
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="postalCode"
                          value={formik.values.postalCode}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          id="postal-code"
                          autoComplete="postal-code"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {formik.errors.postalCode &&
                        formik.touched.postalCode ? (
                          <p className="text-red-600/100">
                            {formik.errors.postalCode}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="phoneNumber"
                          value={formik.values.phoneNumber}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          id="phone"
                          autoComplete="tel"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {formik.errors.phoneNumber &&
                        formik.touched.phoneNumber ? (
                          <p className="text-red-600/100">
                            {formik.errors.phoneNumber}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 border-t border-gray-200 pt-10">
                  <RadioGroup
                    value={selectedDeliveryMethod}
                    onChange={setSelectedDeliveryMethod}
                  >
                    <RadioGroup.Label className="text-lg font-medium text-gray-900">
                      Delivery method
                    </RadioGroup.Label>

                    <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                      {deliveryMethods.map((deliveryMethod) => (
                        <RadioGroup.Option
                          key={deliveryMethod.id}
                          value={deliveryMethod}
                          className={({ checked, active }) =>
                            classNames(
                              checked
                                ? 'border-transparent'
                                : 'border-gray-300',
                              active ? 'ring-2 ring-indigo-500' : '',
                              'relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none'
                            )
                          }
                        >
                          {({ checked, active }) => (
                            <>
                              <div className="flex flex-1">
                                <div className="flex flex-col">
                                  <RadioGroup.Label
                                    as="span"
                                    className="block text-sm font-medium text-gray-900"
                                  >
                                    {deliveryMethod.title}
                                  </RadioGroup.Label>
                                  <RadioGroup.Description
                                    as="span"
                                    className="mt-1 flex items-center text-sm text-gray-500"
                                  >
                                    {deliveryMethod.turnaround}
                                  </RadioGroup.Description>
                                  <RadioGroup.Description
                                    as="span"
                                    className="mt-6 text-sm font-medium text-gray-900"
                                  >
                                    {deliveryMethod.price}
                                  </RadioGroup.Description>
                                </div>
                              </div>
                              {checked ? (
                                <CheckCircleIcon
                                  className="h-5 w-5 text-indigo-600"
                                  aria-hidden="true"
                                />
                              ) : null}
                              <div
                                className={classNames(
                                  active ? 'border' : 'border-2',
                                  checked
                                    ? 'border-indigo-500'
                                    : 'border-transparent',
                                  'pointer-events-none absolute -inset-px rounded-lg'
                                )}
                                aria-hidden="true"
                              />
                            </>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Payment */}
                <div className="mt-10 border-t border-gray-200 pt-10">
                  <h2 className="text-lg font-medium text-gray-900">Payment</h2>

                  <fieldset className="mt-4">
                    <legend className="sr-only">Payment type</legend>
                    <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                      {paymentMethods.map((paymentMethod, paymentMethodIdx) => (
                        <div
                          key={paymentMethod.id}
                          className="flex items-center"
                        >
                          {paymentMethodIdx === 0 ? (
                            <input
                              id={paymentMethod.id}
                              name="payment-type"
                              type="radio"
                              defaultChecked
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          ) : (
                            <input
                              id={paymentMethod.id}
                              name="payment-type"
                              type="radio"
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          )}

                          <label
                            htmlFor={paymentMethod.id}
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            {paymentMethod.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>

                  <div className="mt-6 grid grid-cols-4 gap-y-6 gap-x-4">
                    <div className="col-span-4">
                      <label
                        htmlFor="card-number"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Card number
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="card-number"
                          name="cardNumber"
                          value={formik.values.cardNumber}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          autoComplete="cc-number"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {formik.errors.cardNumber &&
                        formik.touched.cardNumber ? (
                          <p className="text-red-600/100">
                            {formik.errors.cardNumber}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="col-span-4">
                      <label
                        htmlFor="name-on-card"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name on card
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="name-on-card"
                          name="nameOnCard"
                          value={formik.values.nameOnCard}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          autoComplete="cc-name"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {formik.errors.nameOnCard &&
                        formik.touched.nameOnCard ? (
                          <p className="text-red-600/100">
                            {formik.errors.nameOnCard}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="col-span-3">
                      <label
                        htmlFor="expiration-date"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Expiration date (MM/YY)
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="expireDate"
                          value={formik.values.expireDate}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          id="expiration-date"
                          autoComplete="cc-exp"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {formik.errors.expireDate &&
                        formik.touched.expireDate ? (
                          <p className="text-red-600/100">
                            {formik.errors.expireDate}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="cvc"
                        className="block text-sm font-medium text-gray-700"
                      >
                        CVC
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="cvc"
                          value={formik.values.cvc}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          id="cvc"
                          autoComplete="csc"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {formik.errors.cvc && formik.touched.cvc ? (
                          <p className="text-red-600/100">
                            {formik.errors.cvc}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order summary */}
              <div className="mt-10 lg:mt-0">
                <h2 className="text-lg font-medium text-gray-900">
                  Order summary
                </h2>

                <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                  <h3 className="sr-only">Items in your cart</h3>
                  <ul role="list" className="divide-y divide-gray-200">
                    {cart.map((product) => (
                      <li key={product.id} className="flex py-6 px-4 sm:px-6">
                        <div className="flex-shrink-0">
                          <img
                            src={product.images[0].imageSrc}
                            alt={product.images[0].imageAlt}
                            className="w-20 rounded-md"
                          />
                        </div>

                        <div className="ml-6 flex flex-1 flex-col">
                          <div className="flex">
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm">
                                <a
                                  href={product.href}
                                  className="font-medium text-gray-700 hover:text-gray-800"
                                >
                                  {product.name}
                                </a>
                              </h4>
                              <div className="mt-1 flex text-sm">
                              <p className="text-gray-500">{product.color}</p>
                              {product.size ? (
                                <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
                                  {product.size}
                                </p>
                              ) : null}
                            </div>
                            </div>
                           

                            <div className="ml-4 flow-root flex-shrink-0">
                              <button
                                type="button"
                                className="-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500"
                              >
                                <span className="sr-only">Remove</span>

                                <TrashIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                  onClick={() => removeItemFromCart(product)}
                                />
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-1 items-end justify-between pt-2">
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {`$${product.price}`}
                            </p>
                            

                            <div className="ml-4">
                              <label htmlFor="quantity" className="sr-only">
                                Quantity
                              </label>
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
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <dl className="space-y-6 border-t border-gray-200 py-6 px-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm">Subtotal</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {`$${supTotal}`}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-sm">Shipping</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {`$${selectedDeliveryMethod.price}`}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-sm">Taxes</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        $5.52
                      </dd>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                      <dt className="text-base font-medium">Total</dt>
                      <dd className="text-base font-medium text-gray-900">
                        {`$${
                          supTotal! +
                          5.52 +
                          parseInt(selectedDeliveryMethod.price)
                        }`}
                      </dd>
                    </div>
                  </dl>

                  <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                    <button
                      type="button"
                      onClick={() => formik.handleSubmit()}
                      className="w-full rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                    >
                      Confirm order
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </Layout>
  )
}
