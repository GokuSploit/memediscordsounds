/**
 * @name MemeSounds
 * @version 0.5.9
 * @description Plays Memetastic sounds depending on what is being sent in chat. This was heavily inspired by the idea of Metalloriff's bruh plugin so go check him out!
 * @invite YMqKjWEVxG
 * @author 𝓢𝔂𝓻𝓸𝔁 | KoppaBlyat#2033
 * @authorId 414236577733017611
 * @source https://github.com/Lonk12/BetterDiscordPlugins/blob/main/MemeSounds/MemeSounds.plugin.js
 * @updateUrl https://raw.githubusercontent.com/Lonk12/BetterDiscordPlugins/main/MemeSounds/MemeSounds.plugin.js
 */

module.exports = (() => {
	
	/* Configuration */
	const config = {info: {name: "Meme Sounds", authors: [{name: "𝓢𝔂𝓻𝓸𝔁 | KoppaBlyat#2033", discord_id: "414236577733017611", github_username: "Lonk12", twitter_username: "wolfyypaw"},{name: "FlyMaster#2642", discord_id: "459726660359553025", github_username: "Apceniy"}], version: "0.5.9", description: "Plays Memetastic sounds depending on what is being sent in chat. This was heavily inspired by the idea of Metalloriff's bruh plugin so go check him out!", github: "https://github.com/Lonk12/BetterDiscordPlugins/blob/main/MemeSounds/MemeSounds.plugin.js", github_raw: "https://raw.githubusercontent.com/Lonk12/BetterDiscordPlugins/main/MemeSounds/MemeSounds.plugin.js"}, defaultConfig: [{id: "setting", name: "Sound Settings", type: "category", collapsible: true, shown: true, settings: [{id: "LimitChan", name: "Limit to the current channel only.", note: "When enabled, sound effects will only play within the currently selected channel.", type: "switch", value: true}, {id: "delay", name: "Sound effect delay.", note: "The delay in miliseconds between each sound effect.", type: "slider", value: 200, min: 10, max: 1000, renderValue: v => Math.round(v) + "ms"}, {id: "volume", name: "Sound effect volume.", note: "How loud the sound effects will be.", type: "slider", value: 1, min: 0.01, max: 1, renderValue: v => Math.round(v*100) + "%"}]}], changelog: [{title: "New Stuff", items: ["simplified the code", "fixed oof and bruh sounds not playing", "fixed sound timings", "fixed sounds not being played in the order they are written", "fixed sound overlapping", "added volume slider in settings"]}]};

	/* Library Stuff */
	return !global.ZeresPluginLibrary ? class {
		constructor() { this._config = config; }
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
		load() {BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {confirmText: "Download Now", cancelText: "Cancel", onConfirm: () => {require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (err, res, body) => {if (err) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9"); await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));});}});}
		start() { }
		stop() { }
	} : (([Plugin, Api]) => {

		const plugin = (Plugin, Api) => { try {
			
			/* Constants */
			const {DiscordModules: {Dispatcher, SelectedChannelStore}} = Api;
			const sounds = [
				{re: /no?ice/gmi, file: "noice.mp3", duration: 200},
				{re: /bazinga/gmi, file: "bazinga.mp3", duration: 550},
				{re: /oof/gmi, file: "oof.mp3", duration: 250},
				{re: /bruh/gmi, file: "bruh.mp3", duration: 470},
				{re: /sad/gmi, file: "tf_nemesis.mp3", duration: 470},
				{re: /lol/gmi, file: "meme-de-creditos-finales.mp3", duration: 300},
				{re: /fbi/gmi, file: "fbi-open-up_dwLhIFf.mp3", duration: 160},
				{re: /pussy/gmi, file: "pussy-sound-effect_1.mp3", duration: 240},
				{re: /pu\$\$y/gmi, file: "pussy-sound-effect_1.mp3", duration: 240},
				{re: /wot\?/gmi, file: "inceptionbutton.mp3", duration: 200},
				{re: /wot/gmi, file: "inceptionbutton.mp3", duration: 200},
				{re: /huh\?/gmi, file: "erro.mp3", duration: 200},
				{re: /huh/gmi, file: "erro.mp3", duration: 200},
				{re: /error/gmi, file: "erro.mp3", duration: 200},
				{re: /idk\?/gmi, file: "erro.mp3", duration: 200},
				{re: /idk/gmi, file: "erro.mp3", duration: 200},
				{re: /gay/gmi, file: "gayyy.mp3", duration: 200},
				{re: /le Z/gmi, file: "_ben-voyons_-eric-zemmour.mp3", duration: 600},
				{re: /amongus/gmi, file: "among_us_trap_remix_bass_boosted_leonz_8455886905626474145-mp3cut.mp3", duration: 200},
				{re: /among us/gmi, file: "among_us_trap_remix_bass_boosted_leonz_8455886905626474145-mp3cut.mp3", duration: 200},	
				{re: /aah/gmi, file: "anime-moan-meme.mp3", duration: 200},	
				{re: /ah/gmi, file: "anime-moan-meme.mp3", duration: 200},	
				{re: /moan/gmi, file: "anime-moan-meme.mp3", duration: 200},
				{re: /stepbro/gmi, file: "what-are-you-doing-step-bro-sound-effect_2oa17gU.mp3", duration: 200},
				{re: /step bro/gmi, file: "what-are-you-doing-step-bro-sound-effect_2oa17gU.mp3", duration: 200},
				{re: /step-bro/gmi, file: "what-are-you-doing-step-bro-sound-effect_2oa17gU.mp3", duration: 200},
				{re: /ph/gmi, file: "pornhub-community-intro.mp3", duration: 200},
				{re: /pornhub/gmi, file: "pornhub-community-intro.mp3", duration: 200},
				{re: /balls/gmi, file: "ballsofsteel.swf.mp3", duration: 200},
				{re: /blls/gmi, file: "ballsofsteel.swf.mp3", duration: 200},
				{re: /wow/gmi, file: "anime-wow-sound-effect.mp3", duration: 200},
				{re: /putin/gmi, file: "wide-putin-walking-but-hes-always-in-frame-full-version-mp3cut.mp3", duration: 150},
				{re: /oh yeh/gmi, file: "01-oh-yeah.mp3", duration: 150},
				{re: /oh yeah/gmi, file: "01-oh-yeah.mp3", duration: 150},
				{re: /yeh/gmi, file: "01-oh-yeah.mp3", duration: 150},
				{re: /cyka/gmi, file: "cyka_blyat_sound_effect.mp3", duration: 200},
				{re: /blyat/gmi, file: "cyka_blyat_sound_effect.mp3", duration: 200},
				{re: /cyka blyat/gmi, file: "cyka_blyat_sound_effect.mp3", duration: 200},
				{re: /quack/gmi, file: "quack_5.mp3", duration: 200},
				{re: /duck/gmi, file: "quack_5.mp3", duration: 200},
				{re: /dam/gmi, file: "friday-damn.mp3", duration: 200},
				{re: /damn/gmi, file: "friday-damn.mp3", duration: 200},
				{re: /ay/gmi, file: "jojos-bizarre-adventure-ay-ay-ay-ay-_-sound-effect.mp3", duration: 200},
				{re: /aya/gmi, file: "jojos-bizarre-adventure-ay-ay-ay-ay-_-sound-effect.mp3", duration: 200},
				{re: /hm/gmi, file: "moyai_UhOO9IW.mp3", duration: 200}
				
				
				

			];

			/* Double message event fix */
			let lastMessageID = null;

			/* Meme Sounds Class */
			return class MemeSounds extends Plugin {
				constructor() {
					super();
				}

				getSettingsPanel() {
					return this.buildSettingsPanel().getElement();
				}
	
				onStart() {
					Dispatcher.subscribe("MESSAGE_CREATE", this.messageEvent);
				}
				
				messageEvent = async ({ channelId, message, optimistic }) => {
					if (this.settings.setting.LimitChan && channelId != SelectedChannelStore.getChannelId())
						return;

					if (!optimistic && lastMessageID != message.id) {
						lastMessageID = message.id;
						let queue = new Map();
						for (let sound of sounds) {
							for (let match of message.content.matchAll(sound.re))
								queue.set(match.index, sound);
						}
						for (let sound of [...queue.entries()].sort((a, b) => a[0] - b[0])) {
							let audio = new Audio("https://github.com/GokuSploit/memediscordsounds/raw/main/sounds/"+sound[1].file);
							audio.volume = this.settings.setting.volume;
							audio.play();
							await new Promise(r => setTimeout(r, sound[1].duration+this.settings.setting.delay));
						}
					}
					
				};
				
				onStop() {
					Dispatcher.unsubscribe("MESSAGE_CREATE", this.messageEvent);
				}
			}
		} catch (e) { console.error(e); }};
		return plugin(Plugin, Api);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
