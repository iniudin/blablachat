class Api::SessionsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:create]

  def create
    user = User.find_by(name: params[:name])
    if user && user.authenticate(params[:password])
      user.regenerate_auth_token
      render json: { user: user.as_json(except: [:password_digest]), token: user.auth_token }, status: :ok
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  def destroy
    current_user.update(auth_token: nil)
    render json: { message: "Logged out successfully" }, status: :ok
  end
end
