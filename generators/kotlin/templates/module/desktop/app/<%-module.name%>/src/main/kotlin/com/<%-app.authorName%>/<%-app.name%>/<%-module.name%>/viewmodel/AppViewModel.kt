package com.<%-app.authorName%>.<%-app.name%>.<%-module.name%>.controller

import tornadofx.*
import javafx.collections.FXCollections

class AppViewModel : ViewModel() {

	val lastMessage = SimpleStringProperty()

	init {
		subscribe<DataSavedEvent> {
			lastMessage.value = it.message
		}
	}
}