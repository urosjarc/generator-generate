package com.<%-app.authorName%>.<%-app.name%>.<%-module.name%>.view

import tornadofx.*
import com.<%-app.authorName%>.<%-app.name%>.<%-module.name%>.viewmodel.AppViewModel

class AppView: View() {
	val appViewModel: AppViewModel by inject()

    override val root = vbox {
        label(appViewModel.lastMessage)
		button("Click me") {
			action { appViewModel.lastMessage = "it clicked"}
		}
    }
}