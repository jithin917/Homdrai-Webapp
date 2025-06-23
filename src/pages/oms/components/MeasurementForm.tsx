import React, { useState } from 'react';
import { X, Save, Ruler } from 'lucide-react';
import { measurementsAPI } from '../../../lib/oms-api';
import type { CustomerMeasurements } from '../../../types/oms';

interface MeasurementFormProps {
  customerId: string;
  onClose: () => void;
  onSaved: () => void;
}

const MeasurementForm: React.FC<MeasurementFormProps> = ({ customerId, onClose, onSaved }) => {
  const [formData, setFormData] = useState<Partial<CustomerMeasurements>>({
    customerId,
    unit: 'cm',
    top: {
      FL: 0, // Full Length
      SH: 0, // Shoulder
      SL: 0, // Sleeve Length
      SR: 0, // Sleeve Round
      MR: 0, // Mid Round
      AH: 0, // Arm Hole
      CH: 0, // Chest
      BR: 0, // Bust Round
      WR: 0, // Waist Round
      HIP: 0, // Hip
      SLIT: 0, // Slit
      FN: 0, // Front Neck
      BN: 0, // Back Neck
      DP: 0, // Dart Point
      PP: 0  // Princess Panel
    },
    bottom: {
      FL: 0, // Full Length
      WR: 0, // Waist Round
      SR: 0, // Seat Round
      TR: 0, // Thigh Round
      LR: 0, // Leg Round
      AR: 0  // Ankle Round
    },
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('top');

  const handleChange = (section: 'top' | 'bottom', field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: numValue
      }
    }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      notes: e.target.value
    }));
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      unit: e.target.value as 'cm' | 'inches'
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await measurementsAPI.create(formData as Omit<CustomerMeasurements, 'id' | 'createdAt' | 'updatedAt'>);
      
      if (response.success) {
        onSaved();
      } else {
        throw new Error(response.error || 'Failed to save measurements');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Ruler className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Customer Measurements</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Unit Selection */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Measurement Unit:</span>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="unit"
                value="cm"
                checked={formData.unit === 'cm'}
                onChange={handleUnitChange}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Centimeters (cm)</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="unit"
                value="inches"
                checked={formData.unit === 'inches'}
                onChange={handleUnitChange}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Inches</span>
            </label>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab('top')}
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === 'top'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Top Measurements
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('bottom')}
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === 'bottom'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Bottom Measurements
            </button>
          </div>

          {/* Top Measurements */}
          {activeTab === 'top' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Length (FL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.top?.FL || 0}
                  onChange={(e) => handleChange('top', 'FL', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shoulder (SH)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.top?.SH || 0}
                  onChange={(e) => handleChange('top', 'SH', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sleeve Length (SL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.top?.SL || 0}
                  onChange={(e) => handleChange('top', 'SL', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sleeve Round (SR)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.top?.SR || 0}
                  onChange={(e) => handleChange('top', 'SR', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mid Round (MR)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.top?.MR || 0}
                  onChange={(e) => handleChange('top', 'MR', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Arm Hole (AH)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.top?.AH || 0}
                  onChange={(e) => handleChange('top', 'AH', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chest (CH)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.top?.CH || 0}
                  onChange={(e) => handleChange('top', 'CH', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bust Round (BR)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.top?.BR || 0}
                  onChange={(e) => handleChange('top', 'BR', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waist Round (WR)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.top?.WR || 0}
                  onChange={(e) => handleChange('top', 'WR', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hip (HIP)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.top?.HIP || 0}
                  onChange={(e) => handleChange('top', 'HIP', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slit (SLIT)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.top?.SLIT || 0}
                  onChange={(e) => handleChange('top', 'SLIT', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Front Neck (FN)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.top?.FN || 0}
                  onChange={(e) => handleChange('top', 'FN', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Back Neck (BN)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.top?.BN || 0}
                  onChange={(e) => handleChange('top', 'BN', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dart Point (DP)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.top?.DP || 0}
                  onChange={(e) => handleChange('top', 'DP', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Princess Panel (PP)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.top?.PP || 0}
                  onChange={(e) => handleChange('top', 'PP', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Bottom Measurements */}
          {activeTab === 'bottom' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Length (FL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.bottom?.FL || 0}
                  onChange={(e) => handleChange('bottom', 'FL', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waist Round (WR)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.bottom?.WR || 0}
                  onChange={(e) => handleChange('bottom', 'WR', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seat Round (SR)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.bottom?.SR || 0}
                  onChange={(e) => handleChange('bottom', 'SR', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thigh Round (TR)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.bottom?.TR || 0}
                  onChange={(e) => handleChange('bottom', 'TR', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leg Round (LR)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.bottom?.LR || 0}
                  onChange={(e) => handleChange('bottom', 'LR', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ankle Round (AR)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.bottom?.AR || 0}
                  onChange={(e) => handleChange('bottom', 'AR', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={handleNotesChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any additional notes about the measurements..."
            ></textarea>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Measurements</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeasurementForm;