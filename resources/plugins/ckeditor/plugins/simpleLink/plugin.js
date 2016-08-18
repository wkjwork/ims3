CKEDITOR.plugins.add( 'simpleLink',
{
	init: function( editor )
	{
		editor.addCommand( 'simpleLinkDialog', new CKEDITOR.dialogCommand( 'simpleLinkDialog' ) );
		editor.ui.addButton( 'SimpleLink',
		{
			label: 'Insert a Link',
			command: 'simpleLinkDialog',
			icon: this.path + 'images/icon.png'
		});
	}
});
