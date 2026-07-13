import definePlugin from "@utils/types";
import "./styles.css"

export default definePlugin({
    name: "StupidHighlighter",
    description: "highlights all mentions of \"genocides\"",
    authors: [{ name: "dobrosaboja", id: 0n }],
    
    start() {
        const observer = new MutationObserver(mutations => {
            for (const mut of mutations) {
                for (const node of mut.addedNodes) {
                    if (!(node instanceof HTMLElement)) continue;
                    let messages = node.querySelectorAll('[class*="messageContent"]');
                    for (const message of messages) {
                        const walker = document.createTreeWalker(message, NodeFilter.SHOW_TEXT);
                        let node;
                        while ((node = walker.nextNode())) {
                            const text = node as Text;
                            if (text.parentElement?.classList.contains("vc-genocides")) continue;
                            const match = text.data.split(/(genocides|genocide)/);
                            let pieces: Node[] = [];
                            for (const phrase of match) {
                                if (phrase === "genocides" || phrase === "genocide") {
                                    let element = document.createElement("span");
                                    element.className = "vc-genocides"
                                    element.textContent = phrase;
                                    pieces.push(element);
                                } else {
                                    pieces.push(document.createTextNode(phrase));
                                }
                            }
                            if (pieces.length > 1) text.replaceWith(...pieces);
                        }
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true});
    }
})