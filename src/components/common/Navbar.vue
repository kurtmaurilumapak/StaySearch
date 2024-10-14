<script setup>
import { ref } from 'vue'


const nav = ref({
  navItems: [
    { title: 'Dashboard', path: '/owner/dashboard', icon: 'mdi-view-dashboard'},
    { title: 'Posts', path: '/owner/post', icon: 'mdi-image-filter-center-focus-weak' },
    { title: 'Messages', path: '/owner/messages', icon: 'mdi-message-processing'},
  ],
 profile: {
    fav: true,
   menu: false,
   message: false,
   hints: true,
   dialog: false,
 },
  drawer: false,
})

const openDialog = () => {
  nav.value.profile.dialog = true;
}
</script>

<template>
  <v-navigation-drawer
  >
    <v-toolbar-title>
      <RouterLink
        style="text-decoration: none;color: inherit;"
        to="/"
        class="d-flex align-center justify-center gap-3 my-5"
      >
        <img
          src="@/assets/logo.png"
          alt="Logo"
          width="40"
          height="40"
        />
        <h2 class="font-weight-bold">
          StaySearch
        </h2>
      </RouterLink>
    </v-toolbar-title>
    <v-list>
      <v-list-item
        class="py-3"
        prepend-avatar="https://cdn.vuetifyjs.com/images/john.jpg"
        subtitle="johndoe@gmailcom"
        title="John Doe"
      >
      </v-list-item>
      <v-list-item
        class="py-5"
        color="green"
        :prepend-icon="item.icon"
        v-for="(item, index) in nav.navItems"
        :key="index"
        :to="item.path"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
      <v-spacer></v-spacer>
    </v-list>
    <template v-slot:append>
      <v-menu
        v-model="nav.profile.menu"
        :close-on-content-click="false"
        location="start"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            size="large"
            color="green-darken-2"
            v-bind="props"
            block
          >
            profile
          </v-btn>
        </template>

        <v-card min-width="300">
          <v-list>
            <v-list-item
              prepend-avatar="https://cdn.vuetifyjs.com/images/john.jpg"
              subtitle="Founder of StaySearch"
              title="John Doe"
              @click="openDialog"
            >
              <template v-slot:append>
                <v-btn
                  :class="nav.profile.fav ? 'text-red' : ''"
                  icon="mdi-heart"
                  variant="text"
                  @click="nav.profile.fav = !nav.profile.fav"
                ></v-btn>
              </template>
            </v-list-item>
            <v-dialog
              v-model="nav.profile.dialog"
              max-width="600"
            >
              <!-- Dialog content here -->
              <v-card
                prepend-icon="mdi-account"
                title="User Profile"
              >
                <v-card-text>
                  <v-row dense>
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <v-text-field
                        label="First name*"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <v-text-field
                        label="Last name*"
                        persistent-hint
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col
                      cols="12"
                    >
                      <v-text-field
                        label="Email*"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col
                      cols="12"
                    >
                      <v-text-field
                        label="Password*"
                        type="password"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col
                      cols="12"
                    >
                      <v-text-field
                        label="Confirm Password*"
                        type="password"
                        required
                      ></v-text-field>
                    </v-col>


                  </v-row>

                  <small class="text-caption text-medium-emphasis">*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    color="primary"
                    @click="nav.profile.dialog = false"
                  >
                    Close
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-list>

          <v-divider></v-divider>

          <v-list>
            <v-list-item>
              <v-switch
                v-model="nav.profile.message"
                color="purple"
                label="Enable messages"
                hide-details
              ></v-switch>
            </v-list-item>

            <v-list-item>
              <v-switch
                v-model="nav.profile.hints"
                color="purple"
                label="Enable hints"
                hide-details
              ></v-switch>
            </v-list-item>
          </v-list>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              variant="text"
              color="red"
              @click="nav.profile.menu = false"
            >
              logout
            </v-btn>

          </v-card-actions>
        </v-card>
      </v-menu>
    </template>
  </v-navigation-drawer>
</template>

