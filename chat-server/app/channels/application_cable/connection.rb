module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      token = request.params[:token] || request.headers['Authorization']&.split(' ')&.last
      if token && (user = User.find_by(auth_token: token))
        user
      else
        reject_unauthorized_connection
      end
    end
  end
end
