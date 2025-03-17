<script lang="ts" setup>
import type { Room } from '~/types';
import { getRooms, joinRoom, createRoom } from '~/utils/rooms';

definePageMeta({
  middleware: 'auth',
});

const router = useRouter();
const isCreateRoomModalOpen = ref(false);
const creatingRoom = ref(false);
const newRoom = reactive<Partial<Room>>({
  name: '',
  public: true,
});
const newRoomErrors = reactive({
  name: '',
});

const { data: rooms, status, error, refresh } = await useLazyAsyncData(
  'rooms',
  () => getRooms(),
);

const handleJoinRoom = async (roomId: string) => {
  try {
    await joinRoom(roomId);
    router.push(`/rooms/${roomId}`);
  }
  catch (error) {
    console.error('Failed to join room:', error);
  }
};

const handleCreateRoom = async () => {
  // Reset errors
  newRoomErrors.name = '';

  // Validate
  if (!newRoom.name) {
    newRoomErrors.name = 'Room name is required';
    return;
  }

  try {
    creatingRoom.value = true;
    const room = await createRoom(newRoom);

    isCreateRoomModalOpen.value = false;
    newRoom.name = '';
    newRoom.public = true;

    refresh();
    router.push(`/rooms/${room.id}`);
  }
  catch (error) {
    console.error('Failed to create room:', error);
  }
  finally {
    creatingRoom.value = false;
  }
};
</script>

<template>
  <div class="mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">
        Chat Rooms
      </h1>
      <UButton @click="isCreateRoomModalOpen = true">
        Create Room
      </UButton>
    </div>

    <div
      v-if="status"
      class="text-center py-10"
    >
      Loading rooms...
    </div>
    <div
      v-else-if="error"
      class="text-center py-10 text-red-500"
    >
      Error loading rooms: {{ error.message }}
    </div>
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <template v-if="rooms && rooms.length > 0">
        <UCard
          v-for="room in rooms"
          :key="room.id"
          class="hover:shadow-md transition-shadow"
        >
          <UCardHeader>
            <div class="flex items-center">
              {{ room.name }}
              <UBadge
                v-if="room.public"
                color="success"
                class="ml-2"
              >
                Public
              </UBadge>
              <UBadge
                v-else
                color="warning"
                class="ml-2"
              >
                Private
              </UBadge>
            </div>
          </UCardHeader>
          <UCardBody />
          <UCardFooter>
            <UButton
              block
              @click="handleJoinRoom(room.id)"
            >
              Enter Room
            </UButton>
          </UCardFooter>
        </UCard>
      </template>
      <div
        v-else
        class="col-span-full text-center py-10 text-gray-500"
      >
        No rooms available. Create a new room to get started.
      </div>
    </div>

    <!-- Create Room Modal -->
    <UModal v-model="isCreateRoomModalOpen">
      <UCard>
        <UCardHeader>
          <div class="text-xl font-bold">
            Create New Room
          </div>
          <p class="text-sm text-gray-500">
            Create a new chat room. Public rooms can be joined by anyone.
          </p>
        </UCardHeader>
        <UCardBody>
          <form
            class="space-y-4"
            @submit.prevent="handleCreateRoom"
          >
            <div class="space-y-2">
              <label
                for="roomName"
                class="block text-sm font-medium"
              >
                Room Name
              </label>
              <UInput
                id="roomName"
                v-model="newRoom.name"
                placeholder="Enter room name"
                required
                :error="newRoomErrors.name"
              />
            </div>
            <UFormGroup>
              <UCheckbox
                v-model="newRoom.public"
                label="Public Room (anyone can join)"
              />
            </UFormGroup>
          </form>
        </UCardBody>
        <UCardFooter class="flex justify-end">
          <UButton
            color="neutral"
            class="mr-2"
            @click="isCreateRoomModalOpen = false"
          >
            Cancel
          </UButton>
          <UButton
            :loading="creatingRoom"
            @click="handleCreateRoom"
          >
            Create Room
          </UButton>
        </UCardFooter>
      </UCard>
    </UModal>
  </div>
</template>
