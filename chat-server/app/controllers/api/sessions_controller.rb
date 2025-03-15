class SessionsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:create]

  def create
    user = User.find_by(email: params[:email])
    if user && user.authenticate(params[:password])
      user.regenerate_auth_token
      render json: { authToken: user.auth_token, user: user }, status: :ok
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end

  def destroy
    current_user.destroy_session
    render json: { message: 'Logged out successfully' }, status: :ok
  end
