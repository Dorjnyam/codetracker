'use client';

import { useState, useEffect, useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Save, 
  RotateCcw, 
  Download, 
  Upload,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { ProgrammingLanguage, TestCase, TestResult } from '@/types/assignment';

interface CodeEditorProps {
  language: ProgrammingLanguage;
  initialCode?: string;
  starterCode?: string;
  testCases?: TestCase[];
  onCodeChange?: (code: string) => void;
  onRunTests?: (code: string) => Promise<TestResult[]>;
  onSave?: (code: string) => Promise<void>;
  readOnly?: boolean;
  height?: string;
}

const languageMap: Record<ProgrammingLanguage, string> = {
  python: 'python',
  javascript: 'javascript',
  typescript: 'typescript',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
  csharp: 'csharp',
  go: 'go',
  rust: 'rust',
  php: 'php',
  ruby: 'ruby',
  swift: 'swift',
  kotlin: 'kotlin',
  scala: 'scala',
  r: 'r',
  matlab: 'matlab',
};

const defaultCode: Record<ProgrammingLanguage, string> = {
  python: `# Write your solution here
def solution():
    pass

# Test your solution
if __name__ == "__main__":
    print(solution())`,
  javascript: `// Write your solution here
function solution() {
    // Your code here
}

// Test your solution
console.log(solution());`,
  typescript: `// Write your solution here
function solution(): any {
    // Your code here
}

// Test your solution
console.log(solution());`,
  java: `public class Solution {
    // Write your solution here
    public static void main(String[] args) {
        // Your code here
    }
}`,
  cpp: `#include <iostream>
using namespace std;

// Write your solution here
int main() {
    // Your code here
    return 0;
}`,
  c: `#include <stdio.h>

// Write your solution here
int main() {
    // Your code here
    return 0;
}`,
  csharp: `using System;

class Program {
    // Write your solution here
    static void Main() {
        // Your code here
    }
}`,
  go: `package main

import "fmt"

// Write your solution here
func main() {
    // Your code here
}`,
  rust: `fn main() {
    // Write your solution here
}`,
  php: `<?php
// Write your solution here

// Test your solution
?>`,
  ruby: `# Write your solution here

# Test your solution`,
  swift: `import Foundation

// Write your solution here`,
  kotlin: `fun main() {
    // Write your solution here
}`,
  scala: `object Solution {
    def main(args: Array[String]): Unit = {
        // Write your solution here
    }
}`,
  r: `# Write your solution here`,
  matlab: `% Write your solution here`,
};

export function CodeEditor({
  language,
  initialCode,
  starterCode,
  testCases = [],
  onCodeChange,
  onRunTests,
  onSave,
  readOnly = false,
  height = '500px',
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode || starterCode || defaultCode[language]);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editorTheme, setEditorTheme] = useState<'light' | 'dark'>('light');
  const [fontSize, setFontSize] = useState(14);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    // Set theme based on system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setEditorTheme(mediaQuery.matches ? 'dark' : 'light');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setEditorTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    }
  }, [initialCode]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Configure editor options
    editor.updateOptions({
      fontSize: fontSize,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      wordWrap: 'on',
      lineNumbers: 'on',
      folding: true,
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: readOnly,
      cursorStyle: 'line',
      automaticClosingBrackets: 'always',
      automaticClosingQuotes: 'always',
      formatOnPaste: true,
      formatOnType: true,
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRunTests();
    });
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      setHasUnsavedChanges(true);
      onCodeChange?.(value);
    }
  };

  const handleRunTests = async () => {
    if (!onRunTests || isRunning) return;

    setIsRunning(true);
    try {
      const results = await onRunTests(code);
      setTestResults(results);
    } catch (error) {
      console.error('Error running tests:', error);
      setTestResults([]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSave = async () => {
    if (!onSave || isSaving) return;

    setIsSaving(true);
    try {
      await onSave(code);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving code:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setCode(starterCode || defaultCode[language]);
    setHasUnsavedChanges(true);
    setTestResults([]);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solution.${language === 'javascript' ? 'js' : language === 'typescript' ? 'ts' : language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.py,.js,.ts,.java,.cpp,.c,.cs,.go,.rs,.php,.rb,.swift,.kt,.scala,.r,.m';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setCode(content);
          setHasUnsavedChanges(true);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const getTestResultIcon = (result: TestResult) => {
    if (result.passed) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getTestResultColor = (result: TestResult) => {
    return result.passed ? 'text-green-600' : 'text-red-600';
  };

  const passedTests = testResults.filter(r => r.passed).length;
  const totalTests = testResults.length;
  const totalPoints = testResults.reduce((sum, r) => sum + r.points, 0);
  const earnedPoints = testResults.reduce((sum, r) => sum + (r.passed ? r.points : 0), 0);

  return (
    <div className="space-y-4">
      {/* Editor Controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Code Editor</CardTitle>
              <Badge variant="outline">{languageMap[language]}</Badge>
              {hasUnsavedChanges && (
                <Badge variant="secondary" className="text-orange-600">
                  Unsaved Changes
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUpload}
                disabled={readOnly}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={readOnly}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={!onSave || isSaving || !hasUnsavedChanges}
              >
                {isSaving ? (
                  <Save className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save
              </Button>
              <Button
                size="sm"
                onClick={handleRunTests}
                disabled={!onRunTests || isRunning}
              >
                {isRunning ? (
                  <Play className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                Run Tests
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border rounded-lg overflow-hidden">
            <Editor
              height={height}
              language={languageMap[language]}
              value={code}
              onChange={handleCodeChange}
              onMount={handleEditorDidMount}
              theme={editorTheme === 'dark' ? 'vs-dark' : 'light'}
              options={{
                fontSize: fontSize,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: 'on',
                lineNumbers: 'on',
                folding: true,
                selectOnLineNumbers: true,
                roundedSelection: false,
                readOnly: readOnly,
                cursorStyle: 'line',
                automaticClosingBrackets: 'always',
                automaticClosingQuotes: 'always',
                formatOnPaste: true,
                formatOnType: true,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>Test Results</span>
                <Badge variant={passedTests === totalTests ? 'default' : 'secondary'}>
                  {passedTests}/{totalTests} passed
                </Badge>
                <Badge variant="outline">
                  {earnedPoints}/{totalPoints} points
                </Badge>
              </div>
            </CardTitle>
            <CardDescription>
              {passedTests === totalTests 
                ? 'All tests passed! 🎉' 
                : `${totalTests - passedTests} test(s) failed`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTestResultIcon(result)}
                      <span className="font-medium">{result.testCaseName}</span>
                      <Badge variant={result.passed ? 'default' : 'destructive'}>
                        {result.points}/{result.maxPoints} pts
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {result.executionTime}ms
                    </div>
                  </div>
                  
                  {!result.passed && (
                    <div className="mt-2 p-2 bg-red-50 rounded text-sm">
                      <div className="flex items-center gap-1 text-red-600 mb-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span className="font-medium">Error:</span>
                      </div>
                      <div className="font-mono text-xs">
                        <div><strong>Expected:</strong> {result.expectedOutput}</div>
                        <div><strong>Actual:</strong> {result.actualOutput}</div>
                        {result.errorMessage && (
                          <div><strong>Error:</strong> {result.errorMessage}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Cases Info */}
      {testCases.length > 0 && testResults.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available Test Cases</CardTitle>
            <CardDescription>
              {testCases.length} test case(s) will be run when you click "Run Tests"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {testCases.map((testCase, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{testCase.name}</span>
                    <Badge variant="outline">{testCase.points} pts</Badge>
                    {testCase.isHidden && (
                      <Badge variant="secondary">Hidden</Badge>
                    )}
                  </div>
                  <Badge variant="outline">{testCase.type}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
