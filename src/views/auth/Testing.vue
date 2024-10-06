<template>
  <v-app>
    <v-app-bar :elevation="0">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-app-bar-title>Application Bar</v-app-bar-title>
    </v-app-bar>

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
                text="Book Activity"
                variant="outlined"
                block
              ></v-btn>
            </template>
          </v-card>
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
                text="Book Activity"
                variant="outlined"
                block
              ></v-btn>
            </template>
          </v-card>
          <!-- Third Card -->
          <v-card
            class="mx-auto"
            color="surface-variant"
            max-width="340"
            subtitle="Subtitle 3"
            title="Card 3"
          >
            <template v-slot:actions>
              <v-btn
                append-icon="mdi-chevron-right"
                color="red-lighten-2"
                text="Book Activity"
                variant="outlined"
                block
              ></v-btn>
            </template>
          </v-card>
        </v-col>
        <!-- Empty Column -->
        <v-col cols="8"></v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<style>
.custom-margin {
  margin-top: 64px; /* Adjust as needed */
}

.custom-arrangement .v-card {
  margin-bottom: 24px; /* Adds space between cards */
  margin-right: 32px; /* Only space on the right side */
}
</style>
