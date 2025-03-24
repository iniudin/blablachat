class Api::RoomsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_room, only: [:show, :update, :destroy, :join, :leave, :members]

  def index
    public_rooms = Room.where(public: true)
    private_rooms = Room.joins(:room_members).where(public: false, room_members: { user_id: current_user.id })
    @rooms = Room.where(id: public_rooms.pluck(:id) + private_rooms.pluck(:id))

    if params[:search].present?
      @rooms = @rooms.where("rooms.name ILIKE ?", "%#{params[:search]}%")
    end

    render json: @rooms.presence || { message: "No rooms found" },
           status: @rooms.any? ? :ok : :not_found
  end

  def show
    return unless authorize_room_access(@room)

    render json: @room.as_json(include: { room_members: { include: { user: { only: [:id, :name, :email] } } } })
  end

  def create
    @room = Room.new(room_params)
    @room.generate_invite_code

    if @room.save
      @room.room_members.create(user: current_user, role: "admin")
      render json: @room, status: :created
    else
      render json: { errors: @room.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  def update
    membership = @room.room_members.find_by(user: current_user)
    unless membership && membership.role == 'admin'
      return render json: { error: "Unauthorized" }, status: :forbidden
    end

    if @room.update(room_params)
      render json: @room
    else
      render json: { errors: @room.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  def destroy
    membership = @room.room_members.find_by(user: current_user)
    unless membership && membership.role == 'admin'
      return render json: { error: "Unauthorized" }, status: :forbidden
    end

    if @room.destroy
      render json: { message: "Room deleted successfully" }
    else
      render json: { errors: @room.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  def join
    unless @room.public
      return render json: { error: "This is a private room. Please use the join_by_invite endpoint with invite code." }, 
             status: :bad_request
    end

    add_user_to_room(@room, current_user)
    render json: @room
  end

  def leave
    @room_member = @room.room_members.find_by(user: current_user)
    if @room_member && @room_member.destroy
      RoomChannel.broadcast_to(@room, { type: "USER_LEFT", user: current_user.as_json(only: [:id, :name]) })
      render json: { message: "Left room successfully" }
    else
      render json: { error: "Not a member of the room" }, status: :forbidden
    end
  end

  def members
    return unless authorize_room_access(@room)
    members = @room.room_members.includes(:user)
    render json: members.as_json(include: { user: { only: [:id, :name, :email] } })
  end

  def invite
    @room = Room.find_by(invite_code: params[:invite_code])
    return render json: { error: "Room not found" }, status: :not_found if @room.nil?

    if @room.invite_code == params[:invite_code]
      add_user_to_room(@room, current_user)
      render json: @room
    else
      render json: { error: "Invalid invite code" }, status: :forbidden
    end
  end

  private

  def set_room
    @room = Room.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Room not found" }, status: :not_found
  end

  def room_params
    params.require(:room).permit(:name, :public, :invite_code)
  end

  def add_user_to_room(room, user)
    unless room.users.include?(user)
      room.room_members.create(user: user)
      RoomChannel.broadcast_to(room, { type: "USER_JOINED", user: user.as_json(only: [:id, :name]) })
    end
  end

  def authorize_room_access(room)
    unless room.public || room.users.include?(current_user)
      render json: { error: "Access denied" }, status: :forbidden
      return false
    end
    true
  end
end
