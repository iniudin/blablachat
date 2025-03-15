class Message < ApplicationRecord
  belongs_to :room
  belongs_to :user

  validates :content, presence: true

  scope :recent, -> (limit = 50) { order(created_at: :desc).limit(limit) }
end
