import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, MapPin, Edit, Ruler, Package, Calendar } from 'lucide-react';
import { customerAPI, measurementsAPI, orderAPI } from '../../../lib/oms-api';
import type { Customer, CustomerMeasurements, Order } from '../../../types/oms';
import MeasurementForm from './MeasurementForm';

interface CustomerDetailsModalProps {
  customerId: string;
  onClose: () => void;
  onUpdate: () => void;
}

const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({ customerId, onClose, onUpdate }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [measurements, setMeasurements] = useState<CustomerMeasurements[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMeasurementForm, setShowMeasurementForm] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    fetchCustomerData();
  }, [customerId]);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      
      // Fetch customer details
      const customerResponse = await customerAPI.getById(customerId);
      if (customerResponse.success) {
        setCustomer(customerResponse.data);
      }
      
      // Fetch customer measurements
      const measurementsResponse = await measurementsAPI.getByCustomerId(customerId);
      if (measurementsResponse.success) {
        setMeasurements(measurementsResponse.data);
      }
      
      // Fetch customer orders
      const ordersResponse = await orderAPI.search({ customerId });
      if (ordersResponse.success) {
        setOrders(ordersResponse.data);
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customer data...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-8 text-center">
          <p className="text-red-600 mb-4">Customer not found</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <User className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{customer.name}</h2>
              <p className="text-gray-600">{customer.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Customer Details
            </button>
            <button
              onClick={() => setActiveTab('measurements')}
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'measurements'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Measurements
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Order History
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Customer Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Full Name</p>
                  <p className="font-medium text-gray-900">{customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Customer ID</p>
                  <p className="font-medium text-gray-900">{customer.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1 text-gray-500" />
                    <p className="font-medium text-gray-900">{customer.phone}</p>
                  </div>
                </div>
                {customer.email && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email Address</p>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1 text-gray-500" />
                      <p className="font-medium text-gray-900">{customer.email}</p>
                    </div>
                  </div>
                )}
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Address</p>
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 mr-1 text-gray-500 mt-1 flex-shrink-0" />
                    <p className="text-gray-900">
                      {customer.address.street && `${customer.address.street}, `}
                      {customer.address.city && `${customer.address.city}, `}
                      {customer.address.state && `${customer.address.state}`}
                      {customer.address.pinCode && ` - ${customer.address.pinCode}`}
                      {customer.address.country && `, ${customer.address.country}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Communication Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={customer.communicationPreferences.email}
                      readOnly
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Email</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={customer.communicationPreferences.sms}
                      readOnly
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">SMS</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={customer.communicationPreferences.whatsapp}
                      readOnly
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">WhatsApp</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Customer Since</p>
                    <p className="font-medium text-gray-900">{formatDate(customer.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                    <p className="font-medium text-gray-900">{orders.length}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Measurements Tab */}
          {activeTab === 'measurements' && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">Body Measurements</h3>
                <button
                  onClick={() => setShowMeasurementForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Ruler className="w-4 h-4" />
                  <span>Add New Measurements</span>
                </button>
              </div>
              
              {measurements.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Ruler className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No measurements recorded yet</p>
                  <button
                    onClick={() => setShowMeasurementForm(true)}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Add Measurements
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {measurements.map((measurement) => (
                    <div key={measurement.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900">Measurements ({measurement.unit})</h4>
                          <p className="text-sm text-gray-500">Recorded on {formatDate(measurement.createdAt)}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-3">Top Measurements</h5>
                          <div className="space-y-2">
                            {Object.entries(measurement.top).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-gray-600">{key}:</span>
                                <span className="font-medium">{value} {measurement.unit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {measurement.bottom && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-3">Bottom Measurements</h5>
                            <div className="space-y-2">
                              {Object.entries(measurement.bottom).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="text-gray-600">{key}:</span>
                                  <span className="font-medium">{value} {measurement.unit}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {measurement.notes && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{measurement.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">Order History</h3>
                <button
                  onClick={() => {
                    onClose();
                    // Redirect to new order form with this customer pre-selected
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Package className="w-4 h-4" />
                  <span>New Order</span>
                </button>
              </div>
              
              {orders.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No orders found for this customer</p>
                  <button
                    onClick={() => {
                      onClose();
                      // Redirect to new order form with this customer pre-selected
                    }}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Create First Order
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Delivery
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-blue-600">{order.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(order.orderDate)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 capitalize">{order.type.replace('_', ' ')}</div>
                            <div className="text-xs text-gray-500">{order.garmentType}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatCurrency(order.totalAmount)}</div>
                            <div className="text-xs text-gray-500">
                              {order.balanceAmount > 0 ? `Balance: ${formatCurrency(order.balanceAmount)}` : 'Paid in full'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                              <span className="text-sm text-gray-900">{formatDate(order.expectedDeliveryDate)}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Measurement Form Modal */}
      {showMeasurementForm && (
        <MeasurementForm
          customerId={customer.id}
          onClose={() => setShowMeasurementForm(false)}
          onSaved={() => {
            setShowMeasurementForm(false);
            fetchCustomerData();
          }}
        />
      )}
    </div>
  );
};

export default CustomerDetailsModal;