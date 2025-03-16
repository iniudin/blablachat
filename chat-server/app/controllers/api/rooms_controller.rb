class Api::RoomsController < ApplicationController
  before_action :authenticate_user!

  def index
    @rooms = Room.where(public: true).or(current_user.rooms.where(public: false))
    render json: @rooms
  end

  def show
    @room = Room.find(params[:id])
    authorize_room_access(@room)
    render json: @room
  end

  def create
    @room = current_user.owned_rooms.build(room_params)
    if @room.save
      @room.room_members.create(user: current_user)
      render json: @room, status: :created
    else
      render json: { errors: @room.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def join
    @room = Room.find_by(id: params[:id])

    if @room.nil?
      render json: { error: "Room not found" }, status: :not_found
      return
    end

    if @room.public || @room.users.include?(current_user)
      add_user_to_room(@room, current_user)
      render json: @room
    elsif params[:invite_code] && @room.invite_code == params[:invite_code]
      add_user_to_room(@room, current_user)
      render json: @room
    else
      render json: { error: "Cannot join room" }, status: :forbidden
    end
  end

  def leave
    @room = Room.find(params[:id])
    @room_member = @room.room_members.find_by(user: current_user)
    if @room_member&.destroy
      RoomChannel.broadcast_to(@room, { type: "USER_LEFT", user: current_user.as_json(only: [:id, :name]) })
      render json: { message: "Left room successfully" }
    else
      render json: { error: "Not a member of the room" }, status: :forbidden
    end
  end

  private

  def room_params
    params.permit(:name, :public)
  end

  def add_user_to_room(room, user)
    unless room.users.include?(user)
      room.room_users.create(user: user)
      RoomChannel.broadcast_to(room, { type: "USER_JOINED", user: user.as_json(only: [:id, :name]) })
    end
  end

  def authorize_room_access(room)
    unless room.public || room.users.include?(current_user)
      render json: { error: "Access denied" }, status: :forbidden
    end
  end
end
