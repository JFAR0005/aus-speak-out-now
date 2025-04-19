
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

interface PostcodeSearchResultsProps {
  error: string | null;
  info: string | null;
  mappings: any[];
  houseResults: any[];
  senateResults: any[];
  chamberType: "house" | "senate" | null;
  debug?: any; // Added for debugging
}

const PostcodeSearchResults: React.FC<PostcodeSearchResultsProps> = ({
  error,
  info,
  mappings,
  houseResults,
  senateResults,
  chamberType,
  debug,
}) => {
  return (
    <>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {info && (
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-700">{info}</AlertDescription>
        </Alert>
      )}

      {mappings.length > 0 && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Location Information:</h3>
          {mappings.map((mapping, index) => (
            <div key={index} className="mb-2 last:mb-0 p-2 bg-white rounded border">
              <p><span className="font-medium">Electorate:</span> {mapping.electorate}</p>
              <p><span className="font-medium">State:</span> {mapping.state}</p>
              {mapping.locality && (
                <p><span className="font-medium">Locality:</span> {mapping.locality}</p>
              )}
              {mapping.postcode && (
                <p><span className="font-medium">Postcode:</span> {mapping.postcode}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {(houseResults.length > 0 || senateResults.length > 0) && (
        <div className="mt-6 space-y-4">
          {houseResults.length > 0 && chamberType !== "senate" && (
            <div>
              <h3 className="text-lg font-semibold mb-2">House of Representatives Candidates</h3>
              <div className="bg-white rounded-lg shadow divide-y">
                {houseResults.map((candidate, index) => (
                  <div key={index} className="p-4">
                    <div className="font-medium">
                      {candidate.ballotGivenName || ''} {candidate.surname || ''}
                    </div>
                    <div className="text-sm text-gray-600">{candidate.partyBallotName || 'Independent'}</div>
                    <div className="text-sm text-gray-500">Electorate: {candidate.electorate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {senateResults.length > 0 && chamberType !== "house" && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Senate Candidates</h3>
              <div className="bg-white rounded-lg shadow divide-y">
                {senateResults.map((candidate, index) => (
                  <div key={index} className="p-4">
                    <div className="font-medium">
                      {candidate.ballotGivenName || ''} {candidate.surname || ''}
                    </div>
                    <div className="text-sm text-gray-600">{candidate.partyBallotName || 'Independent'}</div>
                    <div className="text-sm text-gray-500">State: {candidate.state}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {mappings.length > 0 && houseResults.length === 0 && senateResults.length === 0 && (
        <Alert variant="default" className="mt-4 bg-yellow-50 border-yellow-200">
          <Info className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-700">
            {chamberType === "house" 
              ? `We found your electorate ${mappings[0].electorate}, but couldn't find any House candidates for that area.` 
              : chamberType === "senate"
                ? `We found your state ${mappings[0].state}, but couldn't find any Senate candidates for that area.`
                : `We found your location, but couldn't find any candidates for that area.`}
          </AlertDescription>
        </Alert>
      )}

      {/* Debug information */}
      {debug && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg border border-gray-300">
          <h3 className="font-mono text-sm font-semibold mb-2">Debug Information:</h3>
          <pre className="text-xs overflow-auto p-2 bg-gray-800 text-white rounded">
            {JSON.stringify(debug, null, 2)}
          </pre>
        </div>
      )}
    </>
  );
};

export default PostcodeSearchResults;
