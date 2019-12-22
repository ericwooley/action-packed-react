---
to: src/ui/readme.md
---
# UI
`ui` is for reusable components, which should have 0 concept of anything else
 that is in your app.

## Examples
### Components that belong in ui.
UI components should be simple, pure, and require no context of the application.
Try to imagine that one day, you want to publish an npm package, based on your
ui elements. It should be as easy as copying this folder, and putting a
package.json file in it (and maybe a build system). Think of this as your own
personal bootstrap.
  * Button - simple ui component. It requires no context, or anything to
    be loaded in your app.
  * Grid - Meta component for arranging other components or children
  * Form inputs - keep your UI consistent by defining form inputs here.
  * Avatar - Takes an image, and creates a specific size.
  * Loader - Spinner or progress bar to show throughout the application.

### Components that do not belong in ui.
UI components that are specific to something in your application belong in
components.
  * UserAvatar - maybe it contains a link to user profiles, has knowledge of the
    user model, etc...
