class Api::UsersController < ApplicationController
  skip_before_action :authenticate_user!, only: [:create]

  def create
    user = User.new(user_params)
    if user.save
      render json: { user: user.as_json(except: [:password_digest, :auth_token]), token: user.auth_token }, status: :created
    else
      render json: { error: @message.errors.full_messages.join(", ") }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.permit(:name, :password)
  end
end
