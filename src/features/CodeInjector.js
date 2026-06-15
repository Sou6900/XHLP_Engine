const fs = acode.require('fs');

export class CodeInjector {
    
    // Kotlin vs Java Detection
    detectLanguage(filePath) {
        if (filePath.endsWith('.java')) return 'java';
        if (filePath.endsWith('.kt')) return 'kotlin';
        return null;
    }

    // Import Conflict Detection
    mergeImports(existingContent, newImports) {
        let lines = existingContent.split('\n');
        let lastImportIndex = -1;
        let existingImports = new Set();

        // Scan existing imports
        lines.forEach((line, index) => {
            if (line.trim().startsWith('import ')) {
                existingImports.add(line.trim());
                lastImportIndex = index;
            }
        });

        // Filter duplicates
        let importsToAdd = newImports.map(i => `import ${i};`).filter(i => !existingImports.has(i));
        
        if (importsToAdd.length === 0) return existingContent;

        // Inject after last import or after package declaration
        if (lastImportIndex !== -1) {
            lines.splice(lastImportIndex + 1, 0, ...importsToAdd);
        } else {
            // Fallback: Find package line
            const pkgIndex = lines.findIndex(l => l.trim().startsWith('package '));
            lines.splice(pkgIndex + 1, 0, "", ...importsToAdd);
        }

        return lines.join('\n');
    }

    // onCreate Variations & Injection Strategy
    injectIntoLifecycle(content, methodType, strategy, codeSnippet, language) {
        // Regex to find method start
        // Java: protected void onCreate(Bundle savedInstanceState) {
        // Kotlin: override fun onCreate(savedInstanceState: Bundle?) {
        
        let methodRegex;
        if (language === 'java') {
            methodRegex = new RegExp(`(protected|public)\\s+void\\s+${methodType}\\s*\\(.*?\\)\\s*\\{`, 's');
        } else {
            methodRegex = new RegExp(`override\\s+fun\\s+${methodType}\\s*\\(.*?\\)\\s*\\{?`, 's');
        }

        const match = content.match(methodRegex);
        if (!match) {
            console.warn(`Method ${methodType} not found!`);
            return content;
        }

        const methodStartIndex = match.index;
        const methodBodyStart = methodStartIndex + match[0].length;
        
        // Find closing brace of the method (Basic Braces Counter)
        const methodEndIndex = this.findClosingBrace(content, methodBodyStart);
        const methodBody = content.substring(methodBodyStart, methodEndIndex);

        if (strategy === 'after_setContentView') {
            const setContentViewRegex = language === 'java' 
                ? /setContentView\(.*?\);/ 
                : /setContentView\(.*?\)/;
            
            const setContentMatch = methodBody.match(setContentViewRegex);
            
            if (setContentMatch) {
                // Inject AFTER setContentView
                const insertionPoint = methodBodyStart + setContentMatch.index + setContentMatch[0].length;
                return content.slice(0, insertionPoint) + "\n" + codeSnippet + content.slice(insertionPoint);
            }
        }

        // Fallback: Inject at the end of method (Before closing brace)
        return content.slice(0, methodEndIndex) + "\n" + codeSnippet + content.slice(methodEndIndex);
    }

    // Method Dependency (Interface & Extra Methods)
    injectExtraMethods(content, methodsCode) {
        const lastBraceIndex = content.lastIndexOf('}');
        if (lastBraceIndex !== -1) {
            return content.slice(0, lastBraceIndex) + "\n" + methodsCode + "\n" + content.slice(lastBraceIndex);
        }
        return content;
    }

    // Helper: Find matching closing brace handling nested blocks
    findClosingBrace(content, startIndex) {
        let openCount = 1;
        for (let i = startIndex; i < content.length; i++) {
            if (content[i] === '{') openCount++;
            if (content[i] === '}') openCount--;
            if (openCount === 0) return i;
        }
        return -1; // Error
    }
}