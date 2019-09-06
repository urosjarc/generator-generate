@file:JvmName("App")
package com.<%-app.authorName%>.<%-app.name%>.<%-module.name%>

import com.<%-app.authorName%>.<%-app.name%>.<%-module.name%>.view.AppView
import tornadofx.launch
import tornadofx.App as Application

class App : App(AppView::class)

fun main(args: Array<String>) {
    launch<App>(args)
}