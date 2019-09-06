plugins {
    application
    id(Plug.kotlin_jvm.id)
    id(Plug.javafx.id) version Plug.javafx.version
}

javafx {
    version = Vers.javafx_jvm
    modules("javafx.controls")
}

application {
    mainClassName = "$group.${project.name}.App"
}

dependencies {
    implementation(project(Mods.adapters))
    implementation(Libs.tornadofx)
}
