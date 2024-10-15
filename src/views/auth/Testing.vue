<template>
  <v-app>
    <v-app-bar :elevation="0" color="green">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>StaySearch</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on">
            <v-icon left>expand_more</v-icon>
            <span>Menu</span>
          </v-btn>
        </template>
        <v-list flat> </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app>
      <v-list-item>
        <v-list-item-content> </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>

    <v-container class="custom-margin">
      <v-row class="mb-6" justify="start">
        <v-col cols="4" class="custom-arrangement">
          <!-- First Card -->
          <v-card
            class="mx-auto"
            color="surface-variant"
            max-width="340"
            subtitle="Subtitle 1"
            title="Card 1"
          >
            <template v-slot:actions>
              <v-btn
                append-icon="mdi-chevron-right"
                color="red-lighten-2"
                @click="dialog1 = true"
                text="trial"
                v-bind="activatorProps"
                variant="outlined"
                block
              ></v-btn>
            </template>
          </v-card>
        </v-col>

        <v-dialog v-model="dialog1">
          <v-card>
            <v-card-title>Testing</v-card-title>
            <v-card-text>
              <p>testing</p>
            </v-card-text>
            <v-card-actions>
              <v-btn color="red" text @click="dialog1 = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-col cols="4" class="custom-arrangement">
          <!-- Second Card -->
          <v-card
            class="mx-auto"
            color="surface-variant"
            max-width="340"
            subtitle="Subtitle 2"
            title="Card 2"
          >
            <template v-slot:actions>
              <v-btn
                append-icon="mdi-chevron-right"
                color="red-lighten-2"
                text="trial"
                variant="outlined"
                block
              ></v-btn>
            </template>
          </v-card>
        </v-col>

        <v-col cols="4" class="custom-arrangement">
          <!-- Third Card -->
          <v-card
            class="mx-auto"
            color="surface-variant"
            max-width="300"
            subtitle="Subtitle 3"
            title="Card 3"
          >
            <template v-slot:actions>
              <v-btn
                append-icon="mdi-chevron-right"
                color="red-lighten-2"
                text="trial"
                variant="outlined"
                block
              ></v-btn>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      dialog1: false, // For first dialog
      dialog2: false, // For second dialog
      dialog3: false // For third dialog
    }
  }
}
</script>

<style>
.custom-margin {
  margin-top: 64px; /* Adjust as needed */
}

.custom-arrangement .v-card {
  margin-bottom: 24px; /* Adds space between cards */
}
</style>
